---
name: research
description: Investigate focused facts, comparisons, or broad questions against current primary sources, cross-check material claims, and capture a cited Markdown result. Use when external facts or synthesis would otherwise block the main task.
---

# Research

Use the lightest research mode that can answer the question, then leave one cited result that another session can inspect.

## Select the Mode

Start from material the user already supplied and relevant local code or docs. Separate established facts, claims needing verification, and open questions before searching.

| Request | Mode |
| --- | --- |
| One current fact or narrow documentation question | Focused: use one research lane and the shortest primary-source path |
| A comparison or recommendation | Comparison: define the decision criteria, verify each candidate on the same dimensions, then distinguish evidence from judgment |
| A broad topic requiring synthesis | Deep: split it into a few independent subquestions, research them concurrently when delegation is available and authorized, then synthesize centrally |
| A repeated freshness-sensitive lookup | Complete the current research, then identify it as a monitoring candidate without creating automation unless requested |

A delegated researcher owns its assigned subquestion directly and must not redispatch the same work. Parallel lanes must be non-overlapping; the main session owns cross-source reconciliation and the final result.

## Gather Evidence

1. Prefer primary sources: official documentation, source code, standards, first-party APIs, filings, papers, and authoritative datasets. Use secondary sources for discovery or clearly attributed context.
2. Verify the configured tools and current APIs before promising coverage. Do not make the workflow depend on one named MCP or search provider.
3. Deep-read the sources that carry the decisive claims instead of synthesizing from search snippets.
4. Cross-check material claims. When only one credible source supports a claim, label it as single-source or unverified rather than presenting consensus.
5. Record concrete dates for freshness-sensitive facts and describe important source conflicts, missing evidence, or inaccessible material.
6. Stop when the scoped question is answerable. Do not chase a fixed source count or keep searching to make the report look exhaustive.

## Synthesize

Keep these categories explicit:

- sourced fact;
- user-provided evidence;
- inference or estimate;
- recommendation;
- unresolved gap.

For a focused fact, a short cited note is enough. For comparisons, include the common criteria, evidence per option, trade-offs, and recommendation. For deep research, include an executive summary, findings by subquestion, confidence and conflicts, key takeaways, sources, and a brief methodology.

Write one Markdown file where the repository keeps research notes unless the user requests chat-only output or no repository workspace exists. Return its path and a compact statement of what the evidence establishes. Research informs a decision; use `decision-notes` separately when the chosen direction itself needs a durable rationale.
