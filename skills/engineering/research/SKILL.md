---
name: research
description: Investigate a focused or broad question against current primary sources, separate fact from inference, and capture cited findings as Markdown in the repo. Use when external facts or synthesis would otherwise block the main task.
---

Spin up one **background agent** to do the research, so the main task can continue while it reads. Tell that agent it owns the research directly and must not spawn another copy of the same research task.

Its job:

1. Start from material the user already supplied. Separate established facts, claims needing verification, and open questions rather than restarting from zero.
2. Classify the request as a focused fact, comparison, or broad synthesis. Take the lightest evidence path that can answer it; split broad work into a few answerable subquestions only when needed.
3. Investigate against **primary sources** such as official docs, source code, specs, first-party APIs, and authoritative datasets. Follow every important claim back to the source that owns it; use secondary sources only for discovery or clearly attributed context.
4. For freshness-sensitive facts, record concrete dates. Stop when the scoped question is answerable; do not collect sources merely to increase the count.
5. Write one Markdown file where the repo keeps research notes. Cite claims and separate sourced fact, user-provided evidence, inference, recommendation, and unresolved gaps.
6. Return the file path and a compact statement of what the evidence establishes.
