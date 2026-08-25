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
| 本地范围 | 仓库基础结构，包括 Matt canonical `skills/`、`docs/`、清单和维护脚本；不包括 ECC 来源档案和本地吸收改动 |
| 许可证 | MIT，见 [`LICENSE`](./LICENSE) |
| 本地改动 | `tdd`、`research`、`implement`、`code-review`、`resolving-merge-conflicts` 吸收 ECC 与本地规则；新增个人 `review` 统筹入口、`commit`、`worktree-clean`；其余 Matt canonical 内容保持上游基线 |
| 比较方式 | `git diff 5b15a47f2d7150f545fbcacbfe381787fc0230dc..main` |
| 同步策略 | 保留 `upstream` 远端；同步前按本台账逐项检查个人改动，合并后更新固定基线 |

### affaan-m/ECC

| 字段 | 当前值 |
| --- | --- |
| 状态 | 已按领域吸收，并通过 `skills.sh` 分发 |
| 来源仓库 | <https://github.com/affaan-m/ECC> |
| 来源基线 | `d8409a4b0813771235555e32e3d8046a73988bfa` |
| 来源版本 | `2.2.0` |
| 来源路径 | `skills/`、`rules/react/`、`docs/capability-surface-selection.md`、`LICENSE` |
| 本地路径 | [`skills/engineering`](./skills/engineering)、[`skills/productivity`](./skills/productivity)、[`skills/misc`](./skills/misc)、[`sources/ecc/LICENSE`](./sources/ecc/LICENSE) |
| 导入范围 | 原始 286 个 Skill 中，276 个非重叠入口按领域保留；10 个重叠入口吸收进当前 canonical Skill |
| 许可证 | MIT，见 [`sources/ecc/LICENSE`](./sources/ecc/LICENSE) |
| 本地改动 | 修复分类后的相对链接，将共享引用收进对应 Skill；删除 10 个重叠入口并融合进 canonical Skill；`tdd` 保留风险门禁、计划输入安全、真实 RED/GREEN、测试层级和证据交接；`research` 保留聚焦、比较、深度与监控候选模式、多来源交叉验证和分题并行；其余入口吸收进 Matt `implement` 和本地 `decision-notes` |
| 验证结果 | `skills.sh` 发现 317 个 Skill，名称全部唯一；Codex `quick_validate.py` 为 264 通过、53 失败，其中 22 个是 Matt/beta 既有 Claude 字段，31 个是 ECC 上游 frontmatter 问题 |
| 激活状态 | 由 `npx skills@latest add shay-wong/skills -g` 发现和安装；ECC 子目录不加入继承的 Matt plugin、`ask-matt` 或 maintainer linking script |
| 激活前置 | 当前 `~/.agents/skills` 有 32 个 ECC 同名安装项；接入本仓库前必须逐项替换并验证，避免同时加载两份 |
| 比较方式 | 从固定来源基线重建原始目录清单，再审查分类移动、10 个吸收入口、路径修复和 canonical 差异 |
| 同步策略 | 从 ECC 的固定新提交先比较上游删除、重命名、依赖和兼容性变化，再按当前领域映射更新 276 个入口，并重新审查 10 个已吸收能力 |

吸收到 canonical Skill 的 ECC 入口：

- `tdd-workflow` -> `skills/engineering/tdd`
- `research-ops`、`deep-research` -> `skills/engineering/research`
- `orch-add-feature`、`orch-change-feature`、`orch-fix-defect`、`orch-refine-code`、`orch-build-mvp`、`orch-pipeline` -> `skills/engineering/implement`
- `architecture-decision-records` -> `skills/engineering/decision-notes`

合并后的 `tdd` 不保留 ECC 的自动 checkpoint commit、固定 80% 全仓覆盖或强制独立证据文件；`research` 不绑定 Firecrawl、Exa 或固定来源数量。这些行为与当前授权边界、按风险验证和可替换工具原则冲突，不属于需要保留的优势。

当前 31 个上游兼容性问题均为 `SKILL.md` frontmatter 使用了 Codex 校验器不接受的顶层字段：

`agent-architecture-audit`、`agent-eval`、`agent-self-evaluation`、`benchmark-optimization-loop`、`blender-motion-state-inspection`、`carrier-relationship-management`、`ck`、`customs-trade-compliance`、`data-throughput-accelerator`、`ecc-recipes`、`energy-procurement`、`eval-harness`、`gan-style-harness`、`inventory-demand-planning`、`latency-critical-systems`、`logistics-exception-management`、`mailtrap-email-integration`、`ml-adoption-playbook`、`motion-advanced`、`motion-foundations`、`motion-patterns`、`parallel-execution-optimizer`、`production-scheduling`、`quality-nonconformance`、`react-native-patterns`、`recursive-decision-ledger`、`returns-reverse-logistics`、`skill-comply`、`taste`、`videodb`、`vue-patterns`。

此外，`ecc-tools-cost-audit` 有意引用独立的 `ECC-Tools` 仓库；`configure-ecc`、`plan-canvas` 和部分 Claude 专用工作流仍依赖 ECC 插件、npm 包、hooks 或 Claude 配置目录。这些属于运行依赖，不是本次快照缺失文件。

### czm15053/write-notes-like-deepseek

| 字段 | 当前值 |
| --- | --- |
| 状态 | 已与 ECC `architecture-decision-records` 合并为本地 `decision-notes` canonical Skill |
| 来源仓库 | <https://github.com/czm15053/write-notes-like-deepseek> |
| 来源基线 | `9420c100bcf708502f6bbb5792abf1f43b9506d1` |
| 来源版本 | `0.1.0` |
| 来源路径 | `SKILL.md`、`references/`、`scripts/`、`templates/` |
| 本地路径 | [`skills/engineering/decision-notes`](./skills/engineering/decision-notes) |
| 采用原因 | 统一 ADR 与 Agent Note 的入口，同时保留既有目录兼容、决策分类、生命周期、模板与机械校验 |
| 许可证 | 上游 README 声明 MIT；固定来源提交没有独立 `LICENSE` 文件，GitHub API 也未识别许可证 |
| 本地改动 | 省略来源仓库的 README、package.json 和安装包装；与 ECC ADR 工作流重写为中性的 `decision-notes`；同一决定只保留一份记录；既有 `docs/adr/` 保留编号、索引、查询与 ADR 生命周期，其他重要决定使用分类 Agent Notes；按本仓库标点规则改写 em dash；将 rejected 状态分隔符改为冒号 |
| 验证方式 | 对合并 Skill 运行 Codex `quick_validate.py`；用 ADR 样例检查编号、索引、状态、备选与后果；在临时 Note 树上分别验证合法样例通过、非法样例被 tree 与 format 门禁拒绝 |
| 激活状态 | 由 `npx skills@latest add shay-wong/skills -g` 发现和安装，不加入继承的 Matt plugin |
| 同步策略 | 对比新的固定上游提交，只同步 Agent Note 生命周期、格式和校验行为；同时对照 ECC ADR 契约，保留本地单入口、既有目录兼容、标点与安装边界 |

### Shay 本地 Skills

| 字段 | 当前值 |
| --- | --- |
| 状态 | 3 个独立能力直接进入 engineering；7 个规则 Skill 吸收进 Matt canonical Skill；`add-dir` 主动移除 |
| 来源仓库 | 本机 Git 仓库 `/Users/Shay/.codex` |
| 来源基线 | `c57e09d69347e7c284187e9bf6920a4704b81378` |
| 额外来源 | 当前 `skills/review/SKILL.md` 工作副本，SHA-256 `d0dd795873de59714fcc2241e6a0f2ef62369d612c7c06d0b7df89493f4aa9b6` |
| 来源路径 | `skills/add-dir`、`skills/agent-rules`、`skills/commit`、`skills/git-workflow-standards`、`skills/personal-coding-standards`、`skills/personal-development-workflow`、`skills/review`、`skills/review-standards`、`skills/testing-standards`、`skills/typescript-standards`、`skills/worktree-clean` |
| 本地路径 | [`skills/engineering/review`](./skills/engineering/review)、[`skills/engineering/commit`](./skills/engineering/commit)、[`skills/engineering/worktree-clean`](./skills/engineering/worktree-clean)，以及已增强的 Matt canonical Skill |
| 采用原因 | 保留一个可发现本机补充审查能力的个人统筹入口，以及安全提交、worktree 清理、按风险开发与测试、评审证据门槛和冲突决策规则 |
| 来源归属 | `agent-rules` 及五个 standards Skill 由 ECC Claude Rules 迁移后持续本地化；其余条目由 Shay 的本地历史维护 |
| 许可证 | ECC 派生规则遵循 [`sources/ecc/LICENSE`](./sources/ecc/LICENSE)；本地新增内容遵循本仓库 [`LICENSE`](./LICENSE) |
| 本地改动 | `review`、`commit` 与 `worktree-clean` 成为 promoted engineering Skill；`review` 保留为轻量统筹入口，运行时发现本地审查 Skill，并在 Ponytail 可用时把 `ponytail:ponytail-review` 作为最后的建议性审查；开发、测试、证据规则和 Git 冲突规则继续并入 Matt `implement`、`tdd`、`code-review` 与 `resolving-merge-conflicts`；`agent-rules`、standards 和 development wrapper 删除 |
| 验证结果 | `review`、发现脚本自检、文档/插件索引均通过；全仓维持 53 个既有 frontmatter 兼容失败，未新增失败 |
| 激活状态 | 通过 `skills.sh` 统一安装；本次仍未删除 `~/.codex/skills` 和 `~/.agents/skills` 的现有副本 |
| 同步策略 | 当前仓库完成依赖整理并成为唯一来源后，停止从 `~/.codex/skills` 反向同步；后续修改直接在本仓库维护 |

`add-dir` 因低使用价值且属于原生 workspace root 能力的薄封装而移除，不进入发行版。`skills/in-progress` 的 beta Skill 全部保留，未参与本轮去重。

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
