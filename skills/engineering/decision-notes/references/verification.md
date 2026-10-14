# 按需阅读：校验与本地工具

> 接入 CI、归档或生成本地看板时对照。脚本均从宿主仓库根目录运行，路径相对于 Skill 安装目录。

## 阻断检查

1. **`verify-agent-note-tree.ts`**：检查 lifecycle、class、路径深度、日期文件名、禁止 `INDEX.md`，并验证 active Note 内指向 Note tree 的相对 Markdown 链接。
2. **`verify-agent-note-format.ts`**：检查头部与 lifecycle 一致、Status 唯一、首节、必需节、implemented 禁用提案标题和 Alternatives。兼容 BOM、CRLF、中文标题、全角冒号和受支持的中文小节别名；代码块、引用和 HTML 注释不参与结构识别。
3. **`verify-archived-agent-notes.ts`**：检查归档头部、`manifest.json` SHA-256 封印和 append-only 历史。有 Git 时通过 `AGENT_NOTE_ARCHIVE_BASE_REF` 指定变更前基线；无 Git 时只校验磁盘哈希。`--write` 只追加缺失封印，不重写已有条目。

轻量个人仓库先运行前两个。首次产生归档后启用第三个。团队仓库可复制 `templates/verify-notes.yml` 到宿主的 `.github/workflows/`，并确认项目级 Skill 路径已提交。模板留在 Skill 目录时不会自行执行。

## 非阻断工具

- `check-note-anchors.ts` 扫描源码中的 `// Note:`、`# Note:` 等锚点，报告悬空路径和没有入站代码锚点的 implemented Note。退出码始终为 0，不放进阻断 CI。
- `build-board.ts --init board.html "名称"` 生成按需读取本地目录的轻量页面。
- `build-board.ts --bundle .agents/notes demo.html "名称"` 生成内嵌正文的独立文件。公开分享时加 `--metadata-only`，只保留元数据与关系。默认拒绝覆盖非看板文件，只有用户明确授权时才用 `--force`。

看板是按需本地产物，不在安装、普通 Note 更新或 CI 中自动生成。
