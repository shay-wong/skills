import { clearScreenDown, cursorTo, emitKeypressEvents, moveCursor } from "node:readline";

export function applyChecklistKey(items, selectedItems, cursor, key) {
  const selected = new Set(selectedItems);
  if (key === "up") cursor = (cursor - 1 + items.length) % items.length;
  if (key === "down") cursor = (cursor + 1) % items.length;
  if (key === "space") {
    const item = items[cursor];
    if (selected.has(item)) selected.delete(item);
    else selected.add(item);
  }
  if (key === "a") return { cursor, done: false, selected: new Set(items) };
  if (key === "n") return { cursor, done: false, selected: new Set() };
  return { cursor, done: key === "return", selected };
}

export async function selectItems(items, heading, nonInteractiveHint) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(`${heading} require a choice. ${nonInteractiveHint}`);
  }

  const input = process.stdin;
  const output = process.stdout;
  const wasRaw = input.isRaw;
  const itemIds = items.map((item) => item.id);
  let selected = new Set(itemIds);
  let cursor = 0;
  let renderedLines = 0;

  function render() {
    if (renderedLines > 0) {
      moveCursor(output, 0, -renderedLines);
      cursorTo(output, 0);
      clearScreenDown(output);
    }
    const lines = [
      `Select ${heading}:`,
      ...items.map((item, index) => (
        `${index === cursor ? ">" : " "} [${selected.has(item.id) ? "x" : " "}] ${item.label} (${item.id})`
      )),
      "Up/Down: move  Space: toggle  a: all  n: none  Enter: continue",
    ];
    output.write(`${lines.join("\n")}\n`);
    renderedLines = lines.length;
  }

  emitKeypressEvents(input);
  input.setRawMode(true);
  input.resume();
  output.write("\x1b[?25l");
  render();

  return new Promise((resolve, reject) => {
    function finish(error) {
      input.off("keypress", onKeypress);
      input.setRawMode(wasRaw);
      input.pause();
      output.write("\x1b[?25h");
      if (error) reject(error);
      else resolve(items.filter((item) => selected.has(item.id)));
    }

    function onKeypress(character, key = {}) {
      if (key.ctrl && key.name === "c") {
        finish(new Error(`${heading} selection cancelled.`));
        return;
      }
      const pressed = key.name === "space" || character === " " ? "space" : key.name ?? character;
      const result = applyChecklistKey(itemIds, selected, cursor, pressed);
      selected = result.selected;
      cursor = result.cursor;
      if (result.done) finish();
      else render();
    }

    input.on("keypress", onKeypress);
  });
}
