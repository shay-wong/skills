# 按需阅读：归档、生命周期治理与冻结

> 收尾、复盘或里程碑清理时对照。日常改动只处理当前模块和搜索命中的 Note，不做无关全库清理。

## 日常治理

- 修改模块时，就地更新持有该决定的现行 Note 事实。
- 新建 Note 前按模块名和机制名搜索 active tree，并把每个命中分类为无关、部分重叠、完全取代或过时提案。
- 部分取代时保留两篇并互链。完全取代时先吸收旧篇的独特理由、备选、后果、验证缺口和重引入条件，再决定删除或归档。
- 季度复盘、大版本发布或 active tree 已影响检索时，再集中处理日常搜索遗漏的记录。

## 何时保留 Active

不按字数、年龄或配额判断。下列内容仍指导未来工作时必须留在 active tree：

- 模块职责与所有权边界；
- `never`、不兼容或不提供某能力等否定性保证；
- 安全、隐私或合规约束；
- 仍具诱惑力、容易被再次提出的失败方案；
- 持久化、wire、schema、迁移和兼容性语义；
- 明确的重新引入条件。

只有 implemented Note 已完成且这些指导价值很低时，才移入 `archived/{class}/yyyy-mm-dd-topic.md`。

## 删除、拒绝与归档

- **删除**：新 Note 已吸收旧篇所有独特价值，且所有入站链接已修复。
- **拒绝**：proposed 的前提消失或决定不再推进时，移入 `rejected/` 并写 `Status: rejected: <原因>`。没有防止重犯价值的提案直接删除。
- **归档**：旧篇已被取代但仍有独立历史杠杆时，保留为冻结快照。proposed Note 不得归档。

`feature` Note 只有在能力已从生产代码、配置、schema、持久化、wire、迁移和兼容行为中消失，文档不再宣称可用，测试也不再把它当作可用行为时，才能被 removal Note 完全吸收。

## 标准归档命令

从宿主仓库根目录执行：

```sh
npx tsx .agents/skills/decision-notes/scripts/archive-agent-note.ts \
  .agents/notes/implemented/<class>/<filename>.md \
  [--superseded-by .agents/notes/implemented/<class>/<replacement>.md]
```

命令会：

1. 在 `Status: implemented` 下一行插入 `Archived: YYYY-MM-DD`。
2. 拒绝覆盖同名归档文件，再移动到 `archived/<class>/`。
3. 把 SHA-256 封印追加到 `archived/manifest.json`。
4. 报告 active Note 中仍指向旧位置的相对 Markdown 链接。
5. 使用 `--superseded-by` 时，在新 Note 中增加指向历史快照的链接，不修改归档正文。

已有归档但缺少 manifest 时，可在确认当前内容可信后补封印：

```sh
npx tsx .agents/skills/decision-notes/scripts/verify-archived-agent-notes.ts --write
```

## 永久冻结契约

归档后只允许新增其他归档和 manifest 条目。不得编辑、翻译、重排、移动或删除既有归档，也不得修改或移除已有封印。`verify-archived-agent-notes.ts` 校验头部、磁盘哈希以及相对 Git 基线的 append-only 行为。归档只用于历史考据，当前行为以 active `implemented/` Note 为准。
