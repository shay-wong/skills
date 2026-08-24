---
name: personal-coding-standards
description: "Apply Shay's general coding rules for implementation or refactoring: simplicity, immutability, validation at boundaries, explicit errors, focused files/functions, safe patterns, and performance awareness. Use for broad coding style guidance across languages."
---

# Personal Coding Standards

Use this skill when implementing, refactoring, or reviewing code where no narrower language skill is a better fit.

## Core Principles

- Prefer the simplest solution that works; avoid cleverness and speculative generality.
- Reuse existing utilities and local patterns before adding abstractions.
- Extract duplication only when repetition is real and the abstraction has a clear boundary.
- Organize by feature/domain when possible; keep high cohesion and low coupling.
- Keep functions focused, typically under 50 lines; keep files cohesive, typically 200-400 lines and under 800 unless the local style requires otherwise.
- Avoid deep nesting; prefer early returns and small helper functions.
- Name variables and functions descriptively. Prefer boolean prefixes such as `is`, `has`, `should`, and `can`.
- Keep changes limited to the user's direct request; avoid touching unrelated behavior or files.
- Do not introduce single-use abstractions, configuration, or future-proofing hooks.

## Comments and Constants

- Keep comments and documentation minimal, current, and useful.
- Use brief Chinese comments to explain scenario, intent, constraints, or why; do not translate code line by line.
- Add Chinese intent comments for public/exported APIs, complex business branches, special test data, and counterintuitive assertions when useful.
- Comments are not limited to method-level headers. Add concise Chinese comments inside method bodies before nontrivial business decision points, skip conditions, fallback logic, indexing/grouping steps, candidate-selection rules, and comparison rules.
- Method-level comments should summarize the method's business responsibility; internal comments should explain why a branch or data choice exists.
- Preserve useful internal business comments during refactors and update them with the logic instead of collapsing all context into the method header.
- Avoid comments for obvious assignments or purely mechanical code unless the user explicitly asks for temporary line-by-line reading notes.
- Add or update Chinese comments for new or changed constants, explaining purpose, boundary, threshold, or business meaning.
- Remove or update stale comments whenever code changes invalidate them.

## Immutability

- Prefer immutable updates over mutating existing objects.
- Treat hidden side effects as defects unless the codebase clearly uses mutation as the local pattern.
- When mutation is necessary for performance or framework semantics, keep it local, documented by structure, and covered by tests.

## Error Handling

- Handle errors explicitly at every system boundary.
- Do not silently swallow errors.
- Use user-friendly messages in UI-facing code and detailed context in server logs.
- Preserve original error context where the language/runtime supports it.

## Validation

- Validate user input, external API responses, file content, and other untrusted data before use.
- Prefer schema-based validation when the project already uses a validation library.
- Fail fast with clear messages when required inputs or config are missing.

## Security Baseline

- Never hardcode secrets, API keys, passwords, tokens, or private credentials.
- Check auth, authorization, input validation, database queries, filesystem paths, external calls, crypto, and payment/financial code before claiming completion.
- Avoid error messages that leak sensitive data.

## Patterns

- Repository pattern: hide data access behind a clear interface when storage details would otherwise leak into business logic.
- API responses: prefer consistent envelopes with success/status, data, error, and pagination metadata when the project has no better established contract.
- Skeleton projects: when creating new nontrivial functionality, search for proven local or open-source patterns before building from scratch.
- When existing non-Git patterns conflict, do not splice them together. Pick the newer, more stable, or better-covered pattern and state the basis.
- Do not delegate deterministic behavior such as routing, retries, status handling, or data conversion to model judgment when code or tools can decide it explicitly.

## Performance

- Look for N+1 queries, unbounded queries, missing pagination, expensive repeated work, and avoidable re-renders or recomputation.
- Add caching only when there is a measured or obvious repeated-cost problem and invalidation is clear.
- For build failures, isolate the smallest failing command, fix incrementally, and verify after each fix.
