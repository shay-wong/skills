---
name: to-spec
description: "Turn the current conversation into a spec and publish it to a local .scratch mirror plus active Panel context, or to the configured tracker: no interview, just synthesis of what you've already discussed."
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know.

## Resolve the publication path

Prefer the installed model-invoked `manage-panel` Skill when it is available. Call the Skill tool with `manage-panel` when the current harness exposes it. Otherwise locate `manage-panel` in the authoritative available-Skills catalog, read its complete `SKILL.md`, and follow it.

Let `manage-panel` inspect the current context before any write. If it confirms an active Panel or Jira planning context, use dual-write mode: save the complete local spec at `.scratch/<feature-slug>/spec.md`, then publish the same content through `manage-panel`. Include `Local artifact: .scratch/<feature-slug>/spec.md` in the remote artifact so the two copies can be matched.

If `manage-panel` is unavailable or confirms there is no active Panel context, use the issue tracker and triage vocabulary configured for the repository. If neither path is available, tell the user to run `/configure-skills`.

Resolve the feature slug and publication target before writing. In dual-write mode, write the local artifact first. If remote publication fails, keep the local artifact, report it as not synchronized, and do not retry through another remote tracker.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write the spec using the template below, then publish it through the resolved path.

   - With active Panel or Jira planning context, first write the completed spec to `.scratch/<feature-slug>/spec.md`, then hand the same spec and its local relative path to `manage-panel`. In a Jira planning conversation it saves the Spec as the planning artifact and does not create a Panel Issue. In an ordinary Panel context it searches for the existing requirement before updating or creating an Issue.
   - With the configured tracker fallback, publish the spec as an issue and apply the `ready-for-agent` triage label. No additional triage is needed.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>
