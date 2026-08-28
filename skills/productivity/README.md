# Productivity

General workflow tools, not code-specific.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[grill-me](./grill-me/SKILL.md)**: Get relentlessly interviewed about a plan or design until every branch of the design tree is resolved.
- **[handoff](./handoff/SKILL.md)**: Compact the current conversation into a handoff document so another agent can continue the work.
- **[teach](./teach/SKILL.md)**: Teach the user a new skill or concept over multiple sessions, using the current directory as a stateful teaching workspace.
- **[to-questionnaire](./to-questionnaire/SKILL.md)**: Turn a decision you can't answer alone into a Markdown questionnaire for the one person who can (filled in async, or together over a meeting).
- **[wait-what](./wait-what/SKILL.md)**: Fire this the moment a message doesn't land. The agent re-pitches it with the context you're missing, in plain English, using your `CONTEXT.md` vocabulary.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[grilling](./grilling/SKILL.md)**: Interview the user relentlessly about a plan, decision, or idea until every branch of the design tree is resolved.
- **[writing-for-agents](./writing-for-agents/SKILL.md)**: Writing documents for agents: skills, AGENTS.md/CLAUDE.md, and any doc an agent reaches by a pointer.

## Imported library

Absorbed third-party research, content, business, and personal workflow Skills, including ECC. Install them through the repository `skills.sh` route; they are not part of the inherited Matt plugin.

- **[agent-self-evaluation](./agent-self-evaluation/SKILL.md)**: Use after completing any non-trivial task.
- **[article-writing](./article-writing/SKILL.md)**: Write articles, guides, blog posts, tutorials, newsletter issues, and other long-form content in a distinctive voice derived from supplied examples or brand guidance.
- **[automation-audit-ops](./automation-audit-ops/SKILL.md)**: Evidence-first automation inventory and overlap audit workflow for ECC.
- **[brand-discovery](./brand-discovery/SKILL.md)**: Use when a brand needs to discover or articulate its identity through structured multi-session interviews.
- **[brand-voice](./brand-voice/SKILL.md)**: Build a source-derived writing style profile from real posts, essays, launch notes, docs, or site copy, then reuse that profile across content, outreach, and social workflows.
- **[carrier-relationship-management](./carrier-relationship-management/SKILL.md)**: Codified expertise for managing carrier portfolios, negotiating freight rates, tracking carrier performance, allocating freight, and maintaining strategic carrier relationships.
- **[config-gc](./config-gc/SKILL.md)**: Garbage collection for your Claude Code configuration.
- **[connections-optimizer](./connections-optimizer/SKILL.md)**: Reorganize the user's X and LinkedIn network with review-first pruning, add/follow recommendations, and channel-specific warm outreach drafted in the user's real voice.
- **[content-engine](./content-engine/SKILL.md)**: Create platform-native content systems for X, LinkedIn, TikTok, YouTube, newsletters, and repurposed multi-platform campaigns.
- **[context-budget](./context-budget/SKILL.md)**: Audits Claude Code context window consumption across agents, skills, MCP servers, and rules.
- **[cost-tracking](./cost-tracking/SKILL.md)**: Track and report Claude Code token usage, spending, and budgets from the local ECC cost-tracker metrics log.
- **[council](./council/SKILL.md)**: Convene a four-voice council for ambiguous decisions, tradeoffs, and go/no-go calls.
- **[council-multi-model](./council-multi-model/SKILL.md)**: Add one optional external Codex critique after the existing council has produced a decision draft.
- **[crosspost](./crosspost/SKILL.md)**: Multi-platform content distribution across X, LinkedIn, Threads, and Bluesky.
- **[customer-billing-ops](./customer-billing-ops/SKILL.md)**: Operate customer billing workflows such as subscriptions, refunds, churn triage, billing-portal recovery, and plan analysis using connected billing tools like Stripe.
- **[customs-trade-compliance](./customs-trade-compliance/SKILL.md)**: Codified expertise for customs documentation, tariff classification, duty optimization, restricted party screening, and regulatory compliance across multiple jurisdictions.
- **[email-ops](./email-ops/SKILL.md)**: Evidence-first mailbox triage, drafting, send verification, and sent-mail-safe follow-up workflow for ECC.
- **[energy-procurement](./energy-procurement/SKILL.md)**: Codified expertise for electricity and gas procurement, tariff optimization, demand charge management, renewable PPA evaluation, and multi-facility energy cost management.
- **[finance-billing-ops](./finance-billing-ops/SKILL.md)**: Evidence-first revenue, pricing, refunds, team-billing, and billing-model truth workflow for ECC.
- **[frontend-slides](./frontend-slides/SKILL.md)**: Create stunning, animation-rich HTML presentations from scratch or by converting PowerPoint files.
- **[google-workspace-ops](./google-workspace-ops/SKILL.md)**: Operate across Google Drive, Docs, Sheets, and Slides as one workflow surface for plans, trackers, decks, and shared documents.
- **[growth-log](./growth-log/SKILL.md)**: Use after a complex task, failure, or when reviewing what was learned.
- **[inventory-demand-planning](./inventory-demand-planning/SKILL.md)**: Codified expertise for demand forecasting, safety stock optimization, replenishment planning, and promotional lift estimation at multi-location retailers.
- **[investor-materials](./investor-materials/SKILL.md)**: Create and update pitch decks, one-pagers, investor memos, accelerator applications, financial models, and fundraising materials.
- **[investor-outreach](./investor-outreach/SKILL.md)**: Draft cold emails, warm intro blurbs, follow-ups, update emails, and investor communications for fundraising.
- **[knowledge-ops](./knowledge-ops/SKILL.md)**: Knowledge base management, ingestion, sync, and retrieval across multiple storage layers (local files, MCP memory, vector stores, Git repos).
- **[lead-intelligence](./lead-intelligence/SKILL.md)**: AI-native lead intelligence and outreach pipeline.
- **[logistics-exception-management](./logistics-exception-management/SKILL.md)**: Codified expertise for handling freight exceptions, shipment delays, damages, losses, and carrier disputes.
- **[market-research](./market-research/SKILL.md)**: Conduct market research, competitive analysis, investor due diligence, and industry intelligence with source attribution and decision-oriented summaries.
- **[marketing-campaign](./marketing-campaign/SKILL.md)**: End-to-end marketing campaign planning and execution.
- **[messages-ops](./messages-ops/SKILL.md)**: Evidence-first live messaging workflow for ECC.
- **[openclaw-persona-forge](./openclaw-persona-forge/SKILL.md)**: 为 OpenClaw AI Agent 锻造完整的龙虾灵魂方案。根据用户偏好或随机抽卡， 输出身份定位、灵魂描述(SOUL.md)、角色化底线规则、名字和头像生图提示词。 如当前环境提供已审核的生图 skill，可自动生成统一风格头像图片。 当用户需要创建、设计或定制 OpenClaw 龙虾灵魂时使用。 不适用于：微调已有 SOUL.md、非 OpenClaw 平台的角色设计、纯工具型无性格 Agent。 触发词：龙虾灵魂、虾魂、OpenClaw 灵魂、养虾灵魂、龙虾角色、龙虾定位、 龙虾剧本杀角色、龙虾游戏角色、龙虾 NPC、龙虾性格、龙虾背景故事、 lobster soul、lobster character、抽卡、随机龙虾、龙虾 SOUL、gacha。 Use when creating, designing, or customizing an OpenClaw lobster persona : identity, SOUL.md, name, or avatar prompt.
- **[product-capability](./product-capability/SKILL.md)**: Translate PRD intent, roadmap asks, or product discussions into an implementation-ready capability plan that exposes constraints, invariants, interfaces, and unresolved decisions before multi-service work starts.
- **[product-lens](./product-lens/SKILL.md)**: Use this skill to validate the "why" before building, run product diagnostics, and pressure-test product direction before the request becomes an implementation contract.
- **[production-scheduling](./production-scheduling/SKILL.md)**: Codified expertise for production scheduling, job sequencing, line balancing, changeover optimization, and bottleneck resolution in discrete and batch manufacturing.
- **[project-flow-ops](./project-flow-ops/SKILL.md)**: Operate execution flow across GitHub and Linear by triaging issues and pull requests, linking active work, and keeping GitHub public-facing while Linear remains the internal execution layer.
- **[prompt-optimizer](./prompt-optimizer/SKILL.md)**: Analyze raw prompts, identify intent and gaps, match ECC components (skills/commands/agents/hooks), and output a ready-to-paste optimized prompt.
- **[quality-nonconformance](./quality-nonconformance/SKILL.md)**: Codified expertise for quality control, non-conformance investigation, root cause analysis, corrective action, and supplier quality management in regulated manufacturing.
- **[returns-reverse-logistics](./returns-reverse-logistics/SKILL.md)**: Codified expertise for returns authorization, receipt and inspection, disposition decisions, refund processing, fraud detection, and warranty claims management.
- **[seo](./seo/SKILL.md)**: Audit, plan, and implement SEO improvements across technical SEO, on-page optimization, structured data, Core Web Vitals, and content strategy.
- **[skill-scout](./skill-scout/SKILL.md)**: Search existing local, marketplace, GitHub, and web skill sources before creating a new skill.
- **[skill-stocktake](./skill-stocktake/SKILL.md)**: Audit installed or repository Skill catalogs for overlap, stale guidance, broken discovery, and low-value entries.
- **[social-graph-ranker](./social-graph-ranker/SKILL.md)**: Weighted social-graph ranking for warm intro discovery, bridge scoring, and network gap analysis across X and LinkedIn.
- **[social-publisher](./social-publisher/SKILL.md)**: Agent-driven scheduling and publishing of social media posts across 13 platforms via SocialClaw.
- **[strategic-compact](./strategic-compact/SKILL.md)**: Suggests manual context compaction at logical intervals to preserve context through task phases rather than arbitrary auto-compaction.
- **[taste](./taste/SKILL.md)**: A creative-direction (taste) layer for music videos and short-form edits in the angelcore / cloud-trance / hyperpop visual family.
- **[tasteforge-video](./tasteforge-video/SKILL.md)**: Use for file-driven multimodal image, video, and 3D-asset discovery; taste interviews; distill or apply workflows; style-pack validation; editable EDL/FCPXML export; provenance audits; and offline planning that must fail closed before provider generation.
- **[team-builder](./team-builder/SKILL.md)**: Interactive agent picker for composing and dispatching parallel teams.
- **[token-budget-advisor](./token-budget-advisor/SKILL.md)**: Offers the user an informed choice about how much response depth to consume before answering.
- **[unified-memory](./unified-memory/SKILL.md)**: Share durable, inspectable context and handoffs between Claude, Codex, Hermes, Cursor, OpenCode, and other agents through the local ECC Memory Vault.
- **[unified-notifications-ops](./unified-notifications-ops/SKILL.md)**: Operate notifications as one ECC-native workflow across GitHub, Linear, desktop alerts, hooks, and connected communication surfaces.
- **[video-editing](./video-editing/SKILL.md)**: AI-assisted video editing workflows for cutting, structuring, and augmenting real footage.
- **[videodb](./videodb/SKILL.md)**: See, Understand, Act on video and audio.
- **[x-api](./x-api/SKILL.md)**: X/Twitter API integration for posting tweets, threads, reading timelines, search, and analytics.
