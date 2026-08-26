---
name: gitlab-mr
description: "创建、查看、增量修改和验证 GitLab Merge Request，并按仓库级 Fork Custom Command 默认值组装创建参数，或按需安装 push 后自动同步 MR 描述的本地 Git Hook。用户提到 GitLab MR、合并请求、新建或创建 MR、查看 MR、更新标题或描述、Draft、Ready、目标分支、assignee、reviewer、milestone、squash 或 MR 自动同步 Hook 时使用。"
---

# GitLab MR

## 操作路由

- **创建**：发现仓库和分支，读取 Fork 默认值，检查重复 MR，创建后回读验证。
- **查看**：读取指定 IID、分支或当前分支的 MR，不产生修改。
- **修改**：先回读现有 MR，只增量修改用户点名的字段，再回读验证。
- **Hook**：仅在用户明确要求时安装 push 自动同步；Hook 只更新现有 opened MR。

不要让创建流程从 `glab mr view <iid>` 开始，也不要因为没有 IID 阻断创建。

## 共同发现

1. 确认当前目录属于 Git 仓库，读取仓库根目录、当前分支、`origin` URL 和工作区状态。
2. 从 `origin` URL 解析 GitLab project path；对支持 `-R` 的 `glab` 命令显式传入该 project，避免误用其它 remote。
3. 将 `refs/heads/`、`refs/remotes/` 和 `origin/` 前缀规范化为普通分支名。
4. MR 内容涉及代码改动时，读取目标分支到源分支的完整 commit 和 diff，并读取仓库现有 MR 模板。上线命令只能来自当前发布脚本或用户明确说明。
5. 区分已提交分支内容和未提交工作区改动；不得声称未提交改动已经进入 MR。

## 创建 MR

### 1. 解析创建默认值

默认值优先级为：用户明确指定 > 当前仓库 Fork 配置 > 本 Skill 的 Draft 默认值 > GitLab 项目或 `glab` 的其它默认值。创建状态没有被用户或 Fork 配置明确指定时，必须传入 `--draft`；不得把某个仓库当前的人员、目标分支、milestone 或 squash 默认值硬编码进本 Skill。

先用 `git rev-parse --git-path fork/custom-commands.json` 定位当前 checkout 的配置；若该文件不存在，再读取 `git rev-parse --path-format=absolute --git-common-dir` 下的 `fork/custom-commands.json`。后者用于 linked worktree 继承主仓库的 Fork 配置。两处都不存在时使用 GitLab 项目或 `glab` 默认值。配置存在时：

- 查找创建 GitLab MR 的 custom command，读取 controls 的 `defaultValue`、`checkedValue`、`uncheckedValue` 和文本默认值。
- checkbox 选中时采用 `checkedValue`；未选中时仅在 `uncheckedValue` 非空时采用它。Draft control 明确未选中表示 Ready，即使其 `uncheckedValue` 为空，也应覆盖本 Skill 的 Draft 默认值。
- 用户提供的标题、描述、源分支、目标分支或元数据覆盖对应默认值。
- 动态分支默认值只按其明确语义用只读 Git 命令重新求值，例如当前分支或最高版本号的 `release/*` 分支；不得对 JSON 中的字符串执行通用 `eval`。
- 若 action 调用共享 helper，可读取 helper 确认参数映射和边界行为，但 Codex 应直接组装 `glab mr create`，不得伪造 Fork UI 的 15/16 个位置参数调用 helper。
- 配置没有某个 control 时视为仓库不提供该默认能力。例如没有 milestone control 时，不得擅自添加 milestone。

### 2. 避免重复创建

源分支和目标分支确定后，用 `glab mr list -R <project> --source-branch <source> --target-branch <target> --output json` 查询 opened MR。

- 已有匹配 MR 时不得重复创建，也不得重新套用 Fork 默认元数据。
- 用户只是要求创建时，改为回读并报告现有 MR。
- 用户同时明确提供了标题、描述或元数据修改时，转入增量修改流程，只应用这些显式修改。

### 3. 组装创建内容

- 用户指定或根据仓库规则生成了标题/描述时，使用 `--title` / `--description`，并忽略 `--fill` 与 `--fill-commit-body`。
- 只有标题和描述都未手动提供或生成、且 Fork 默认启用 `--fill` 时，才使用 `--fill`。
- `--fill-commit-body` 只能随实际生效的 `--fill` 使用。
- 只有描述而没有标题且不能使用 `--fill` 时，从最新 commit subject 推导标题；仍为空时使用源分支名。
- 采用 Fork 配置默认选择的 Draft、push、assignee、reviewer、remove-source、squash、web 和确认参数；用户明确指定时按用户值覆盖。Draft 状态仍缺失时传入 `--draft`，其它缺失项使用项目默认值。

### 4. 解析 milestone

- 只有用户明确指定或 Fork 配置提供 milestone control 时才处理。
- 普通标题或 ID 原样传给 `--milestone`。
- 值为 `latest` 或“最新”时，用从 `origin` 解析的 project 显式查询 active milestones。优先在语义版本标题中按数字分段排序取最高版本；没有语义版本标题时，按 due date 和标题选择最新项。
- 没有 active milestone 时省略 `--milestone`，不得阻断 MR 创建。
- 使用 `--web` 时保留浏览器确认语义；若还需 milestone，在 MR 真正创建并可回读后再用 `glab mr update` 设置。不得因为浏览器中尚未提交而无限轮询或宣称创建完成。

### 5. 创建并验证

直接用参数数组或等价的安全引用方式执行 `glab mr create -R <project> --source-branch <source> --target-branch <target> ...`。不得拼接后再用 `eval` 执行。

创建后必须重新定位并用 `glab mr view <iid> -R <project> --output json` 回读，核对：

- title 和 description
- source branch 和 target branch
- Draft 状态
- assignee 和 reviewer
- milestone
- remove source branch 和 squash 设置

只有最终回读与请求及所选默认值一致时，才能报告创建完成。

## 查看 MR

用用户给出的 IID 或分支执行 `glab mr view <iid-or-branch> -R <project> --output json`。没有显式标识时先查当前分支的 opened MR；存在多个候选时列出候选，不猜测目标。

## 增量修改 MR

1. 用 `glab mr view <iid-or-branch> -R <project> --output json` 读取标题、描述、源/目标分支、Draft 和全部相关元数据。
2. 只修改用户要求的字段或文案。保留未点名内容的文字、顺序、格式、checkbox 状态和 MR 元数据。
3. 用 `glab mr update` 执行修改。除非用户明确要求，不得切换 Draft/Ready、目标分支、assignee、reviewer、label、milestone、remove-source 或 squash。
4. `--remove-source-branch` 和 `--squash-before-merge` 是 toggle；先读取当前值，仅在用户要求的目标值不同时调用一次。
5. assignee/reviewer 的无前缀值会替换现有列表；需要增删单个人时使用 `+`、`-` 或 `!` 语义，避免误删其它人。
6. 再次回读，逐项确认请求的差异准确且没有附带改动。

## 编辑规则

- “改一下”或“优化一下”不授权整段重写；默认做最小增量编辑。
- 已有格式优先于通用最佳实践。除非用户明确要求规范化，否则不得增加新章节。
- 不得凭经验添加上线命令。发布脚本已处理的迁移、缓存、重启等步骤不得重复列为人工操作。
- 需要重写描述时，先保留原文，并按用户确认的模板生成完整正文。
- 写入后必须回读最终正文；只报告实际修改的内容。

## 通用仓库规则

新建 MR 或用户明确要求完整重写时，优先使用仓库已有 MR 模板。仓库没有模板时，可以根据实际改动描述以下相关内容，不机械补齐无关章节：

- 关联任务
- 改动内容
- 接口或数据变化
- 验证结果
- 上线步骤
- 风险与回滚

## 四个仓库的 Jira 规则

当仓库根目录名或 Git remote 的项目名表明当前仓库是 `tapon`、`tapon-api`、`shortnovel-api` 或 `dragonwell-api` 时：

- 默认标题由 Jira 任务号、一个空格和清理后的 Jira 任务标题组成。清理时只移除原始标题开头连续的 `【...】` 分类标签及其后的空白，保留正文其它内容不变；不得移除正文中间的括号内容。
- Jira 任务号和任务标题必须来自用户提供的信息、现有 MR 或可读取的 Jira 任务，不得根据代码改动猜测任务标题。分支名只能用于提取其中明确存在的任务号。
- `Draft:` 是 GitLab 展示的状态前缀，不属于 MR 标题；通过 `--draft` 控制 Draft 状态，不把该前缀写入标题。
- 有对应任务时，描述的最后一个非空内容使用 `Close [<任务 ID>](<任务链接>)`；任务 ID 和链接必须来自用户、现有 MR 或可读取的 Jira 任务，不得猜测。没有可验证任务时省略该行。
- `tapon` 的其它描述内容继续遵循仓库模板或现有格式，不套用下面三个 API 仓库的精简模板。

## 三个 API 仓库的描述规则

当仓库是 `tapon-api`、`shortnovel-api` 或 `dragonwell-api` 时，默认 MR 描述使用以下基础格式：

```markdown
改动内容：

- <本分支实际完成的行为改动>

Close [<任务 ID>](<任务链接>)
```

只有确实存在发布脚本未覆盖、必须人工执行的操作时，才在 `Close` 前追加：

```markdown
上线步骤：

- [ ] <必须人工执行的步骤>
```

- 除末尾任务 `Close` 行外，只保留 `改动内容`，以及存在真实人工操作时的 `上线步骤`，使用简洁事实列表。
- 不默认增加其它 Jira 描述、测试统计、接口明细、数据设计、迁移、回滚或上线后验证。
- `上线步骤` 只列发布脚本未覆盖、必须人工执行的操作；没有此类操作时省略整个章节，不得写“无”“暂无”“不涉及”或空 checkbox。
- 修改现有 MR 时只调整用户点名的行，不顺手润色其它文案。

## Push 自动同步

- 仅在用户明确要求配置本地 Hook 时，执行 `scripts/install-pre-push-hook.sh <仓库路径>`；普通 MR 操作不得自动安装。
- 安装器把仓库的 `pre-push` 链接到 Skill 内的统一脚本，并拒绝覆盖已有的非托管 Hook。
- Hook 适用于该 clone 的所有 worktree。它在 push 时后台等待 GitLab MR 的 SHA 更新，确认 MR 仍为 `opened` 后才用 `codex exec --ephemeral` 调用本 Skill。
- Hook 从 `GIT_BIN`、`GLAB_BIN` 和 `CODEX_BIN` 读取显式路径，否则通过 `PATH` 解析对应命令。
- Hook 只允许更新已存在的 opened MR，绝不创建 MR。
- Push 失败、没有 opened MR、MR 已关闭或合并、或 GitLab 在 120 秒内未同步目标 SHA 时，不修改 MR。
- 主日志、最近一次完整输出和最终消息写入触发 push 的 worktree Git 目录下，文件名以 `codex-mr-hook` 开头。
