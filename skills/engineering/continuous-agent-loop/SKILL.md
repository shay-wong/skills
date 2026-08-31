---
name: continuous-agent-loop
description: Patterns for continuous autonomous agent loops with quality gates, evals, and recovery controls. Use when running an agent loop that must self-check, gate on evals, and recover from failures.
metadata:
  origin: ECC
---

# Continuous Agent Loop

This is the v1.8+ canonical loop skill.

## Loop Selection Flow

```text
Start
  |
  +-- Need strict CI/PR control? -- yes --> ralphinho-rfc-pipeline
  |
  +-- Need RFC decomposition? -- yes --> ralphinho-rfc-pipeline
  |
  +-- Need exploratory parallel generation? -- yes --> infinite
  |
  +-- default --> sequential
```

## Combined Pattern

Recommended production stack:
1. RFC decomposition (`ralphinho-rfc-pipeline`)
2. write-time quality checks (`plankton-code-quality`)
3. eval loop (`eval-harness`)
4. final acceptance verification (`verification-loop`)
5. filesystem-backed session notes for cross-iteration state

## Failure Modes

- loop churn without measurable progress
- repeated retries with same root cause
- merge queue stalls
- cost drift from unbounded escalation

## Recovery

- freeze loop
- diagnose the harness with `agent-architecture-audit`
- reduce scope to failing unit
- replay with explicit acceptance criteria
