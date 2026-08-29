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
| 本地改动 | 发行包、Claude plugin 和 fallback marketplace 统一为 `shay-skills` / `shay` 与 `shay-wong/skills`；`setup-matt-pocock-skills` 无兼容别名地重命名为中立入口 `configure-skills`；`ask-matt` 无兼容别名地重命名为个人入口 `ask-me`，并按是否需要写入 `CONTEXT.md` 或 ADR 来选择 `grill-me` 与 `grill-with-docs`；两个显式 grill 入口通过 Skill tool 或可用 Skills 目录复用 `grilling` 与 `domain-modeling`，不复制共享协议；`tdd`、`research`、`implement`、`code-review`、`resolving-merge-conflicts` 吸收 ECC 与本地规则；`code-review`、`wizard`、`codebase-design` 与 `to-tickets` 的入口描述压缩为触发条件和核心职责；新增个人 `review` 统筹入口、`commit`、`worktree-clean`；其余 Matt canonical 内容保持上游基线 |
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
| 导入范围 | 原始 286 个 Skill 中，168 个技术栈入口按领域保留；10 个重叠入口吸收进当前 canonical Skill；`continuous-learning-v2` 的实现归并到原名 `continuous-learning`；107 个非技术栈、外部产品入口或旧兼容入口移除 |
| 许可证 | MIT，见 [`sources/ecc/LICENSE`](./sources/ecc/LICENSE) |
| 本地改动 | 修复分类后的相对链接，将共享引用收进对应 Skill；删除 10 个重叠入口并融合进 canonical Skill；只保留语言、框架、数据库、基础设施、网络、安全、测试、性能、移动端、Web3、医疗软件、视频工程与 AI 系统技术能力；删除内容、运营、研究、业务职能、ECC 管理、配置维护、外部产品和通用流程入口；删除旧兼容入口 `autonomous-loops`，统一使用 `continuous-agent-loop`；将 `continuous-learning-v2` 的完整项目级 instinct 实现迁回 `continuous-learning`，不保留版本化别名；`tdd` 保留风险门禁、计划输入安全、真实 RED/GREEN、测试层级和证据交接；`research` 保留聚焦、比较、深度与监控候选模式、多来源交叉验证和分题并行；其余重叠入口吸收进 Matt `implement` 和本地 `decision-notes` |
| 验证结果 | `skills.sh` 发现 213 个 Skill，仓库清单检查确认名称全部唯一且四个 bucket README 与目录一致；Codex `quick_validate.py` 为 178 通过、35 失败，其中 23 个是 Matt、beta 或其他既有 Claude 字段，12 个是保留的 ECC 上游 frontmatter 问题；`continuous-learning` 的解析测试、Python 与 Shell 语法、安装器 9 项测试、插件清单严格校验、版本同步和 `git diff --check` 均通过 |
| 激活状态 | 由 `npx skills@latest add shay-wong/skills -g` 发现和安装；ECC 子目录不加入继承的 Matt plugin、`ask-me` 或 maintainer linking script |
| 本机替换状态 | 本机保留入口使用指向本仓库对应目录的符号链接；本轮删除入口中仅清理解析到本仓库的失效链接，不影响其他来源 Skill |
| 比较方式 | 从固定来源基线重建原始目录清单，再审查分类移动、10 个吸收入口、路径修复和 canonical 差异 |
| 同步策略 | 从 ECC 的固定新提交先比较上游删除、重命名、依赖和兼容性变化，只同步技术栈范围内的 168 个入口，并重新审查 10 个已吸收能力；不恢复非技术栈、外部产品、版本化重复或旧兼容入口 |

吸收到 canonical Skill 的 ECC 入口：

- `tdd-workflow` -> `skills/engineering/tdd`
- `research-ops`、`deep-research` -> `skills/engineering/research`
- `orch-add-feature`、`orch-change-feature`、`orch-fix-defect`、`orch-refine-code`、`orch-build-mvp`、`orch-pipeline` -> `skills/engineering/implement`
- `architecture-decision-records` -> `skills/engineering/decision-notes`

合并后的 `tdd` 不保留 ECC 的自动 checkpoint commit、固定 80% 全仓覆盖或强制独立证据文件；`research` 不绑定 Firecrawl、Exa 或固定来源数量。这些行为与当前授权边界、按风险验证和可替换工具原则冲突，不属于需要保留的优势。

删除的 107 个 ECC 入口：

`agent-self-evaluation`、`agent-sort`、`agentic-engineering`、`ai-first-engineering`、`article-writing`、`automation-audit-ops`、`autonomous-loops`、`brand-discovery`、`brand-voice`、`carrier-relationship-management`、`ck`、`claude-devfleet`、`code-tour`、`codebase-onboarding`、`codehealth-mcp`、`competitive-platform-analysis`、`competitive-report-structure`、`config-gc`、`configure-ecc`、`connections-optimizer`、`content-engine`、`context-budget`、`council`、`council-multi-model`、`crosspost`、`customer-billing-ops`、`customs-trade-compliance`、`delivery-gate`、`dmux-workflows`、`documentation-lookup`、`ecc-guide`、`ecc-recipes`、`ecc-tools-cost-audit`、`email-ops`、`energy-procurement`、`exa-search`、`fal-ai-media`、`finance-billing-ops`、`flox-environments`、`frontend-slides`、`gan-style-harness`、`github-ops`、`google-workspace-ops`、`growth-log`、`hermes-imports`、`hookify-rules`、`inventory-demand-planning`、`investor-materials`、`investor-outreach`、`ito-baskets`、`ito-compute`、`ito-inference`、`ito-training`、`jira-integration`、`knowledge-ops`、`laravel-plugin-discovery`、`lead-intelligence`、`living-docs-governance`、`logistics-exception-management`、`mailtrap-email-integration`、`market-research`、`marketing-campaign`、`messages-ops`、`ml-adoption-playbook`、`nanoclaw-repl`、`nasiko-control-plane`、`nutrient-document-processing`、`openclaw-persona-forge`、`opensource-pipeline`、`parallel-execution-optimizer`、`plan-canvas`、`plan-orchestrate`、`prediction-market-oracle-research`、`prediction-market-risk-review`、`product-capability`、`product-lens`、`production-scheduling`、`project-flow-ops`、`prompt-optimizer`、`quality-nonconformance`、`recursive-decision-ledger`、`returns-reverse-logistics`、`rules-distill`、`scientific-db-pubmed-database`、`scientific-db-uspto-database`、`scientific-pkg-gget`、`scientific-thinking-literature-review`、`scientific-thinking-scholar-evaluation`、`search-first`、`security-scan`、`seo`、`setup-repo-scan`、`skill-comply`、`skill-stocktake`、`social-graph-ranker`、`social-publisher`、`strategic-compact`、`taste`、`tasteforge-video`、`terminal-ops`、`uncloud`、`unified-memory`、`unified-notifications-ops`、`videodb`、`visa-doc-translate`、`workspace-surface-audit`、`x-api`。

当前保留的 12 个上游兼容性问题均为 `SKILL.md` frontmatter 使用了 Codex 校验器不接受的顶层字段：

`agent-architecture-audit`、`agent-eval`、`benchmark-optimization-loop`、`blender-motion-state-inspection`、`data-throughput-accelerator`、`eval-harness`、`latency-critical-systems`、`motion-advanced`、`motion-foundations`、`motion-patterns`、`react-native-patterns`、`vue-patterns`。

依赖感知安装器不再声明外部 `repo-scan` 或 `ecc-universal` plan-canvas runtime，因为对应仓库入口已删除。Anthropic `frontend-design` 仍由保留的 `frontend-design-direction` 提供可选安装入口。

### ComposioHQ/awesome-claude-skills: changelog-generator

| 字段 | 当前值 |
| --- | --- |
| 状态 | 已吸收为本地 `changelog` Skill |
| 来源仓库 | <https://github.com/ComposioHQ/awesome-claude-skills> |
| 来源基线 | `044d48b594f060c164f3b20fac9ea01374721bca` |
| 来源路径 | `changelog-generator/SKILL.md` |
| 本地路径 | [`skills/engineering/changelog`](./skills/engineering/changelog) |
| 采用原因 | 保留从 Git 历史生成用户可读变更记录、产品更新、App Store 文案和 Release Notes 的独立能力，并为完整发布流程提供单一的 changelog 入口 |
| 许可证 | 上游 README 声明 Apache-2.0；固定来源提交没有仓库根 `LICENSE`，Skill 目录也没有独立许可证文件 |
| 本地改动 | 重命名为短入口 `changelog`；删除营销式重复说明和固定 emoji 示例；吸收 Baoyu 发布流程中的精确范围、多语言文件、外部贡献者归属与独立 Release Notes 能力；增加无 Tag 仓库的范围 fallback、行为证据核查和不夸大结果规则；明确该 Skill 不修改版本、不提交、不打 Tag、不推送、不发布产物或 GitHub Release |
| 验证方式 | 运行 Codex `quick_validate.py`；检查 `$release` 反向路由、文件链接、名称唯一性和 repository-owned prose 标点规则 |
| 激活状态 | 由 `npx skills@latest add shay-wong/skills -g` 发现和安装，不加入继承的 Matt plugin 或 `ask-me` |
| 本机替换状态 | 旧 `changelog-generator` 副本已移入废纸篓，本机改由 `~/.agents/skills/changelog` 与 `~/.claude/skills/changelog` 链接到本仓库版本 |
| 同步策略 | 对比新的固定上游提交，只同步能提高用户可读性、范围准确性和输出格式适配的行为；继续由本地 `changelog` 统一承接发布说明生成 |

### JimLiu/baoyu-skills: release-skills

| 字段 | 当前值 |
| --- | --- |
| 状态 | 已吸收为本地 `release` Skill |
| 来源仓库 | <https://github.com/JimLiu/baoyu-skills> |
| 来源基线 | `80a1c2970a17722e4f1242118600f90249e37b5a` |
| 来源路径 | `.claude/skills/release-skills/SKILL.md` |
| 本地路径 | [`skills/engineering/release`](./skills/engineering/release) |
| 采用原因 | 保留多项目版本检测、语义版本建议、多语言 changelog、校验、release commit、annotated tag、产物 Hook、GitHub Release 和历史 Release 回填能力 |
| 许可证 | 固定来源提交的 README 声明 MIT；当时没有仓库根 `LICENSE`，该 Skill 也没有独立许可证文件 |
| 本地改动 | 重命名为短入口 `release`；将配置与回填模式拆到按需 references；删除 changelog fallback 与重复生成规则，由 `$changelog` 统一负责 changelog 和 Release Notes，已有且经用户批准的说明可直接复用；保留 `.releaserc.yml`、`prepare_artifact`、`publish_artifact`、signed tag 与 GitHub Release 行为；移除普通 `push` 强制升级为完整发布的规则；把版本、commit、tag、push、产物发布和 GitHub Release 拆成显式授权边界；将确认提前到文件与 Git 修改之前，并要求验证通过后才能 commit、tag 或发布；输入机制改为当前 runtime 中立表述 |
| 验证方式 | 运行 Codex `quick_validate.py`；检查 `$changelog` 硬依赖、已有说明复用路径、references 链接、名称唯一性和 repository-owned prose 标点规则 |
| 激活状态 | 由 `npx skills@latest add shay-wong/skills -g` 发现和安装，不加入继承的 Matt plugin 或 `ask-me`；单独安装发布能力时同时选择仓库内的 `changelog` 与 `release` |
| 本机替换状态 | 旧 `release-skills` 副本已移入废纸篓，本机改由 `~/.agents/skills/release` 与 `~/.claude/skills/release` 链接到本仓库版本 |
| 同步策略 | 对比新的固定上游提交，分别审查项目检测、版本规则、产物 Hook、Tag 与 GitHub Release 行为；保留本地授权边界、验证门禁和 `changelog` 单一职责分工 |

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
| 状态 | 5 个独立能力直接进入 engineering；7 个规则 Skill 吸收进 Matt canonical Skill；`add-dir` 主动移除 |
| 来源仓库 | 本机 Git 仓库 `/Users/Shay/.codex` |
| 来源基线 | `c57e09d69347e7c284187e9bf6920a4704b81378` |
| 额外来源 | 当前 `skills/review/SKILL.md` 工作副本，SHA-256 `d0dd795873de59714fcc2241e6a0f2ef62369d612c7c06d0b7df89493f4aa9b6`；当前 `skills/gitlab-mr/SKILL.md` 与 `agents/openai.yaml` 工作副本，SHA-256 分别为 `d0b58dc1d3cb4496bc9297b5e5c12f45a8ca1570df95ce5178720a1844451fd3`、`af7c0c1ab9a4e077c2c201757eb5d0a8044a19d70d61b96722bd92147404a512`；当前 `skills/fork-doc/SKILL.md` 与 `agents/openai.yaml` 工作副本，SHA-256 分别为 `7d32c6d3c54f52eb198305a4185e1e86d2f8fa3477a9f6068ed3fffc62bebba8`、`df2d68b616f8caa1335c852119f4a3d0fc09a23f90f90d815e505685059726ab` |
| 来源路径 | `skills/add-dir`、`skills/agent-rules`、`skills/commit`、`skills/fork-doc`、`skills/git-workflow-standards`、`skills/gitlab-mr`、`skills/personal-coding-standards`、`skills/personal-development-workflow`、`skills/review`、`skills/review-standards`、`skills/testing-standards`、`skills/typescript-standards`、`skills/worktree-clean` |
| 本地路径 | [`skills/engineering/review`](./skills/engineering/review)、[`skills/engineering/commit`](./skills/engineering/commit)、[`skills/engineering/gitlab-mr`](./skills/engineering/gitlab-mr)、[`skills/engineering/fork-doc`](./skills/engineering/fork-doc)、[`skills/engineering/worktree-clean`](./skills/engineering/worktree-clean)，以及已增强的 Matt canonical Skill |
| 采用原因 | 保留一个可发现本机补充审查能力的个人统筹入口，以及安全提交、GitLab MR 管理、Fork 差异与版本文档维护、worktree 清理、按风险开发与测试、评审证据门槛和冲突决策规则 |
| 来源归属 | `agent-rules` 及五个 standards Skill 由 ECC Claude Rules 迁移后持续本地化；其余条目由 Shay 的本地历史维护 |
| 许可证 | ECC 派生规则遵循 [`sources/ecc/LICENSE`](./sources/ecc/LICENSE)；本地新增内容遵循本仓库 [`LICENSE`](./LICENSE) |
| 本地改动 | `review`、`commit`、`gitlab-mr`、`fork-doc` 与 `worktree-clean` 成为 promoted engineering Skill；`review` 与 `fork-doc` 的入口描述压缩为触发条件和核心职责；`commit` 保留无显式范围时的当前任务 fallback、Git 原生 ignored 检测和歧义分组处理，并新增提交请求不授权 push、PR、历史改写或远端修改的边界；`commit` 与 `worktree-clean` 将本机专用的 `/opt/homebrew/bin/git` 改为由 `PATH` 解析的 `git`，同时继续用 `git -C <repo>` 绑定仓库；`gitlab-mr` 采用本机当前工作副本，保留 Fork 默认值、重复 MR 防护、Jira 模板、增量更新和显式安装的 push 同步 Hook，将 Hook 中固定的 Git、`glab` 和 `codex` 路径改为环境变量优先、`PATH` 回退，并修复安装器把相对 hooks 路径解析到调用目录的问题；`fork-doc` 采用本机当前工作副本，保留 standalone 与父 Git workflow 的授权边界、准确的 upstream baseline、重要手工 merge resolution 的独立功能提交要求，以及禁止用文档提交伪装已拆分历史的规则；`review` 优先复用当前 harness 的可用 Skill 清单，仅在清单缺失或不完整时扫描本地审查 Skill；恢复本机版的 GitHub feedback、Ponytail audit、game、架构及语言框架路由，五级优先级、required/advisory 分类、上下文决策、finding ledger、证据门槛、冲突仲裁、五态结果、三轮审查、两轮修复、90 分钟预算和大型候选分片；ECC prompt 绝对路径改为已安装领域 Skill 映射；agent 等待、线程映射和 circuit-breaker 操作继续由 `AGENTS.md` 管理；`review-standards` 的风险匹配验证、变化行为测试、信任边界、敏感信息和有界数据访问规则并入 Matt `code-review` 的 Standards 轴，不再作为独立审查；其他开发、测试、证据和 Git 冲突规则继续并入 Matt `implement`、`tdd`、`code-review` 与 `resolving-merge-conflicts`；`agent-rules`、standards 和 development wrapper 删除 |
| 验证结果 | `review`、扩展后的发现脚本自检、`commit`、`gitlab-mr`、`fork-doc` 与 `worktree-clean` Skill 校验、GitLab MR Hook 的 ShellCheck、语法及临时仓库安装烟测、外部依赖安装器的全选、逐项勾选、全部跳过、Ponytail marketplace 注册、Codex 插件安装、外部 Skill 安装、全局 npm runtime 和非交互保护路径、文档/插件索引和 `claude plugin validate . --strict` 均通过；全仓既有 frontmatter 兼容失败单独记录，不归因于本次改动 |
| 激活状态 | 通过 `skills.sh` 统一安装；依赖感知安装器将 Ponytail、GitHub PR feedback 和 `review-game` 作为 `review` 的可选外部依赖；本机旧个人副本与已吸收的 wrapper 已移入废纸篓，保留入口通过 `~/.agents/skills` 与 `~/.claude/skills` 的符号链接直接使用本仓库版本 |
| 同步策略 | 当前仓库完成依赖整理并成为唯一来源后，停止从 `~/.codex/skills` 反向同步；后续修改直接在本仓库维护 |

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
