# Skill 来源与本地改造台账

本文档记录当前仓库实际采用的外部 Skill 来源，以及相对于来源版本所做的本地改动。它面向维护者和 AI 编码代理，用于审查来源、同步上游和避免丢失个人定制。

## 维护规则

- 只记录已经进入当前仓库的 Skill。仅浏览、评估或添加为 Git 远端的项目不算采用。
- 引入来源 Skill 时，在同一次变更中记录来源仓库、来源路径、固定提交或版本、许可证、本地路径和初始改动。
- 修改、重命名或删除来源 Skill 时，同步更新对应条目的本地改动、同步策略和状态。
- 来源基线必须使用固定提交，不使用会移动的分支名称代替。
- 上游已提供等价能力且本地不再需要差异时，先验证行为，再删除本地改动说明或整个来源条目。
- 插件、全局安装和其他独立更新的 Skill 不因本机可用而自动纳入本仓库。

## 当前来源

### mattpocock/skills

| 字段 | 当前值 |
| --- | --- |
| 状态 | 基础来源，持续跟踪 |
| 来源仓库 | <https://github.com/mattpocock/skills> |
| 来源基线 | `5b15a47f2d7150f545fbcacbfe381787fc0230dc` |
| 来源版本 | `1.2.3` |
| 上游分支 | `upstream/main` |
| 本地范围 | 仓库基础结构，包括 `skills/`、`docs/`、清单和维护脚本；不包括 `vendor/ecc/` 和本台账相关的个人维护改动 |
| 许可证 | MIT，见 [`LICENSE`](./LICENSE) |
| 本地改动 | Skill 行为改动：无。当前差异是来源台账、ECC 第三方快照及其文档入口 |
| 比较方式 | `git diff 5b15a47f2d7150f545fbcacbfe381787fc0230dc..main` |
| 同步策略 | 保留 `upstream` 远端；同步前按本台账逐项检查个人改动，合并后更新固定基线 |

### affaan-m/ECC

| 字段 | 当前值 |
| --- | --- |
| 状态 | 已导入上游快照，尚未接入本地安装和插件分发 |
| 来源仓库 | <https://github.com/affaan-m/ECC> |
| 来源基线 | `d8409a4b0813771235555e32e3d8046a73988bfa` |
| 来源版本 | `2.2.0` |
| 来源路径 | `skills/`、`rules/react/`、`docs/capability-surface-selection.md`、`LICENSE` |
| 本地路径 | [`vendor/ecc/skills`](./vendor/ecc/skills)、[`vendor/ecc/rules/react`](./vendor/ecc/rules/react)、[`vendor/ecc/docs/capability-surface-selection.md`](./vendor/ecc/docs/capability-surface-selection.md) |
| 导入范围 | 286 个 Skill，包含 Skill 目录内的脚本、引用、模板、示例和资源 |
| 许可证 | MIT，见 [`vendor/ecc/LICENSE`](./vendor/ecc/LICENSE) |
| 本地改动 | 无。导入文件与固定来源基线一致，仅改变了仓库中的存放前缀 |
| 验证结果 | 254 个 Skill 通过 Codex `quick_validate.py`；32 个保留上游 frontmatter 兼容性问题，见下方清单 |
| 激活状态 | 未加入 `.claude-plugin/plugin.json`、`ask-matt` 或 `scripts/link-skills.sh`，也未启用 ECC Codex 插件 |
| 激活前置 | 当前 `~/.agents/skills` 有 32 个 ECC 同名安装项；接入本仓库前必须逐项替换并验证，避免同时加载两份 |
| 比较方式 | 将来源基线的上述路径导出后，与 `vendor/ecc/` 执行目录级差异比较 |
| 同步策略 | 从 ECC 的固定新提交重新导出相同路径，先审查上游删除、重命名、依赖和兼容性变化，再替换快照并更新本条目 |

当前 32 个上游兼容性问题均为 `SKILL.md` frontmatter 使用了 Codex 校验器不接受的顶层字段：

`agent-architecture-audit`、`agent-eval`、`agent-self-evaluation`、`benchmark-optimization-loop`、`blender-motion-state-inspection`、`carrier-relationship-management`、`ck`、`customs-trade-compliance`、`data-throughput-accelerator`、`ecc-recipes`、`energy-procurement`、`eval-harness`、`gan-style-harness`、`inventory-demand-planning`、`latency-critical-systems`、`logistics-exception-management`、`mailtrap-email-integration`、`ml-adoption-playbook`、`motion-advanced`、`motion-foundations`、`motion-patterns`、`parallel-execution-optimizer`、`production-scheduling`、`quality-nonconformance`、`react-native-patterns`、`recursive-decision-ledger`、`returns-reverse-logistics`、`skill-comply`、`taste`、`tdd-workflow`、`videodb`、`vue-patterns`。

此外，`ecc-tools-cost-audit` 有意引用独立的 `ECC-Tools` 仓库；`configure-ecc`、`plan-canvas` 和部分 Claude 专用工作流仍依赖 ECC 插件、npm 包、hooks 或 Claude 配置目录。这些属于运行依赖，不是本次快照缺失文件。

### Shay 本地核心 Skills

| 字段 | 当前值 |
| --- | --- |
| 状态 | 已吸收 10 个稳定核心 Skill，尚未加入当前插件 |
| 来源仓库 | 本机 Git 仓库 `/Users/Shay/.codex` |
| 来源基线 | `c57e09d69347e7c284187e9bf6920a4704b81378` |
| 来源路径 | `skills/add-dir`、`skills/agent-rules`、`skills/commit`、`skills/git-workflow-standards`、`skills/personal-coding-standards`、`skills/personal-development-workflow`、`skills/review-standards`、`skills/testing-standards`、`skills/typescript-standards`、`skills/worktree-clean` |
| 本地路径 | [`skills/personal`](./skills/personal) |
| 采用原因 | 保留 Shay 的工作流路由、提交边界、Git 与删除安全、开发规范、评审规范和 worktree 清理规则 |
| 来源归属 | `agent-rules` 及五个 standards Skill 由 ECC Claude Rules 迁移后持续本地化；其余条目由 Shay 的本地历史维护 |
| 许可证 | ECC 派生内容遵循 [`vendor/ecc/LICENSE`](./vendor/ecc/LICENSE)；本地新增内容遵循本仓库 [`LICENSE`](./LICENSE) |
| 本地改动 | 将 `agent-rules` 的六个本机绝对路径改为仓库内相对链接，其余 Skill 内容与固定本地基线一致 |
| 验证结果 | 10 个 Skill 均通过 Codex `quick_validate.py` |
| 激活状态 | `scripts/link-skills.sh` 可发现这些仓库内 Skill，但本次未运行脚本，也未移除 `~/.codex/skills` 中的现有副本 |
| 同步策略 | 当前仓库完成依赖整理并成为唯一来源后，停止从 `~/.codex/skills` 反向同步；后续修改直接在本仓库维护 |

当前仓库已形成第一批个人核心 Skill。后续吸收、改造或移除来源 Skill 时，应继续在这里按实际范围逐项登记。

## 新来源条目模板

新增来源时复制以下字段，并删除不适用的说明：

```markdown
### owner/repository: skill-name

| 字段 | 当前值 |
| --- | --- |
| 状态 | 长期保留 / 等待上游吸收 / 停止维护 |
| 来源仓库 | URL |
| 来源路径 | path/to/skill |
| 来源基线 | 完整提交 SHA 或不可变版本 |
| 本地路径 | path/to/local/skill |
| 许可证 | 许可证及本地文件路径 |
| 采用原因 | 解决的问题 |
| 本地改动 | 相对来源的具体行为差异 |
| 验证方式 | 可运行的检查命令或人工检查点 |
| 同步策略 | 如何检查更新，以及保留或移除差异的条件 |
```
