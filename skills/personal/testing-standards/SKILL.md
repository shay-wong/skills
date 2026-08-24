---
name: testing-standards
description: "Apply Shay's testing rules: TDD when appropriate, unit/integration/E2E coverage by risk, AAA structure, descriptive names, and targeted verification. Use when adding tests, fixing bugs, or deciding validation scope."
---

# Testing Standards

Use this skill when writing tests, fixing bugs, or deciding how to verify a change.

## Coverage Expectation

Aim for coverage that matches risk. The standing target for substantive feature work is 80%+ relevant coverage where the project can measure it. For narrow fixes, a focused regression test is more important than broad coverage churn.
Tests should verify business intent, constraints, and boundaries, not just make the suite green.

## Test Types

- Unit tests: individual functions, utilities, components.
- Integration tests: API endpoints, database operations, cross-module contracts.
- E2E tests: critical user flows and browser/device workflows.

## TDD Workflow

For bug fixes and risky behavior changes:

1. Write or identify a failing test first.
2. Run it and confirm it fails for the expected reason.
3. Implement the minimal fix.
4. Rerun the test and confirm it passes.
5. Refactor only after behavior is locked.
6. Run the smallest broader check needed to prove no related regressions.

## Test Style

- Prefer Arrange-Act-Assert structure.
- Use descriptive names that explain behavior, not implementation.
- For nontrivial tests, add brief Chinese comments explaining scenario, business intent, constraints, special test data, or counterintuitive assertions.
- Test comments are not limited to the method PHPDoc. Add concise Chinese comments inside the test body before special fixtures, non-obvious setup, boundary cases, and assertions whose business meaning is not obvious from the assertion alone.
- Do not comment every assertion mechanically; explain why the case matters or what business rule it locks.
- Fix implementation when tests reveal real bugs; change tests only when the test is wrong or the requirement changed.
- Keep tests deterministic and isolated.

## PHP/PHPUnit Style

For Laravel/PHPUnit tests in repos that use this style:

- Prefer descriptive `snake_case` method names without a `test_` prefix.
- Put the PHPUnit marker in a multi-line PHPDoc below the Chinese business-intent comment:

```php
/**
 * 中文说明测试场景、业务意图或约束。
 *
 * @test
 */
public function descriptive_behavior_name(): void
{
}
```
