---
name: to-tickets
description: Turn a plan, spec, or conversation into tracer-bullet tickets with explicit blocking edges, published to local .scratch mirrors plus active Panel context, or to the configured tracker.
disable-model-invocation: true
---

# To Tickets

Break a plan, spec, or conversation into a set of **tickets**: tracer-bullet vertical slices, each declaring the tickets that **block** it.

## Resolve the publication path

Prefer the installed model-invoked `manage-panel` Skill when it is available. Call the Skill tool with `manage-panel` when the current harness exposes it. Otherwise locate `manage-panel` in the authoritative available-Skills catalog, read its complete `SKILL.md`, and follow it.

Let `manage-panel` inspect the current context before any write. If it confirms an active Panel or Jira planning context, use dual-write mode: save every approved ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, then publish the same tickets through `manage-panel`. Include each `Local artifact: .scratch/<feature-slug>/issues/<NN>-<slug>.md` path in its remote ticket so the copies can be matched. After publication succeeds, record the exact returned Panel identifier and status in the local ticket's `Panel issue` and `Panel status` fields.

Do not also publish to GitHub or GitLab merely because the repository uses that code host. When the user explicitly requests both Panel and code-host Issues, treat the local ticket as the join record: add the exact `GitHub issue` or `GitLab issue` URL to it and copy that same provider-specific field into the Panel child Issue. Never use a Panel identifier as the code-host Issue value or as a branch hint.

If `manage-panel` is unavailable or confirms there is no active Panel context, use the issue tracker and triage vocabulary configured for the repository. If neither path is available, tell the user to run `/configure-skills`.

Resolve the feature slug and publication target before writing. In dual-write mode, write every local ticket first. If remote publication fails, keep the complete local set, report it as not synchronized, and do not retry through another remote tracker.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes a reference (a spec path, an issue number or URL) as an argument, fetch it and read its full body and comments.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Ticket titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

Identify shared logic that multiple slices may need. Do not automatically turn it into a horizontal ticket; choose when to extract it from evidence about the consumers and contract.

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window

</vertical-slice-rules>

Shared logic has two valid sequences:

- **Extract first:** use this when the shared contract is already established, multiple slices require exactly the same rule, or consistency is itself a prerequisite. Create one narrow enabling ticket that defines the contract, locks it with tests, and can land green independently. Block every consuming slice on that ticket.
- **Slice first, extract later:** use this when the commonality is inferred, the consumers may differ, or the right abstraction is not yet known. Let each vertical slice own its complete behaviour and tests, then create a consolidation ticket blocked by those slices. That ticket removes proven duplication without changing their behaviour.

The enabling or consolidation ticket is a narrow, independently verifiable refactoring exception, not a tracer bullet. Keep it and the consuming slices as children of the same parent requirement; never put implementation work in the parent itself.

Default to slice first when the shared contract is not yet proven. A helper used by only one slice stays inside that slice. During the quiz, state which sequence the draft uses and the evidence for that choice.

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Is the shared-logic sequence correct: extract first, or slice first and extract after the behaviour is proven?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Publish the tickets through the resolved path

Publish only the approved breakdown. The tickets are the same either way; only the publication mechanism and relationship representation change:

- **Panel or Jira planning through `manage-panel`** → first write the approved ticket set under `.scratch/<feature-slug>/issues/`, including `Panel issue: pending-publication` and `Panel status: pending-publication`, then hand the same breakdown and local-path mapping to that workflow. In an ordinary Panel context, let it search before creating, preserve the existing parent requirement, and create the appropriate parent/sub-issue and blocking relations. In a Jira planning conversation, publish one approved manifest through the Jira planning workflow; do not create tickets one by one. After either publication path succeeds, replace both pending values with the exact identifier and status returned for each Panel Issue. When explicitly publishing the same tickets to GitHub or GitLab, also replace the matching provider-specific pending URL locally and include the final URL in the Panel child description. If any local metadata update fails, report the local mirror as unsynchronized instead of claiming dual-write completion.
- **Local files** → write one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first). Each file's "Blocked by" lists the numbers/titles it depends on. Use the per-ticket file template below: one ticket per file, never a single combined file.
- **A real issue tracker (GitHub, Linear, …)** → publish one issue per ticket in dependency order (blockers first) so each ticket's blocking edges can reference real identifiers. Use the platform's native blocking relationship where it has one; otherwise set each ticket's "Blocked by" to the blocking issues. If the source was an existing issue, make each ticket its sub-issue (tracker doc's operation). Apply the `ready-for-agent` triage label unless instructed otherwise; the tickets are agent-grabbable by construction.

Publish enough relationship data for the tracker to identify the **frontier**: tickets whose blockers are all done. Stop after publication. In an active Panel context, Panel owns selecting, binding, and dispatching one unblocked leaf Issue; do not choose a child or invoke implementation from this Skill. For local files or another tracker, report the frontier without starting implementation.

Do not close the parent while publishing its children.

<local-ticket-template>

# <NN>: <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None (can start immediately)".

**Status:** ready-for-agent

<!-- When the user explicitly requests code-host publication, add exactly one matching field:
**GitHub issue:** pending-publication
or
**GitLab issue:** pending-publication
-->

<!-- Dual-write mode only. Replace both values after Panel publication succeeds. -->
**Panel issue:** pending-publication

**Panel status:** pending-publication

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)". Omit this section when blockers were set as native edges.

</issue-template>

In either form, avoid specific file paths or code snippets: they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.
