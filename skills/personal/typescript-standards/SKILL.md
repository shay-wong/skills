---
name: typescript-standards
description: "Apply Shay's TypeScript and JavaScript rules for .ts, .tsx, .js, and .jsx files: explicit public API types, safe unknown narrowing, React prop types, immutable updates, validation, no production console.log, and Playwright for E2E."
---

# TypeScript Standards

Use this skill when working with `.ts`, `.tsx`, `.js`, or `.jsx` files.

## Public Types

- Add parameter and return types to exported functions, shared utilities, and public class methods.
- Let TypeScript infer obvious local variable types.
- Extract repeated inline object shapes into named `interface` or `type` declarations.
- Use `interface` for object shapes that may be extended or implemented.
- Use `type` for unions, intersections, tuples, mapped types, and utility types.
- Prefer string literal unions over `enum` unless interoperability requires an enum.

## Avoid `any`

- Avoid `any` in application code.
- Use `unknown` for external or untrusted input, then narrow safely.
- Use generics when a value's type depends on the caller.

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}
```

## React Props

- Define component props with a named `interface` or `type`.
- Type callback props explicitly.
- Do not use `React.FC` unless there is a specific local reason.

## JavaScript Files

- In `.js` and `.jsx`, use JSDoc when types improve clarity and TypeScript migration is not practical.
- Keep JSDoc aligned with runtime behavior.

## Immutability

- Prefer immutable updates with spread, array methods, or project-local immutable helpers.
- Avoid mutating objects passed into functions unless the local framework or API requires it.

## Error Handling and Validation

- Use `async`/`await` with `try`/`catch` where failure handling is required.
- Catch `unknown` and narrow safely.
- Validate untrusted input. Use Zod or the project's existing schema library when available.

## Logging

- Do not leave `console.log` in production code.
- Use the project's logging library or structured logger when logging is needed.

## Patterns

- API response envelopes should include success/status, optional data, optional error, and pagination metadata when no stronger local contract exists.
- Custom hooks should be named with `use`, keep side effects explicit, and clean up subscriptions/timers.
- Repository abstractions should hide storage details and keep business logic independent of persistence.

## Testing

- Use Playwright for E2E coverage of critical browser user flows unless the project already uses another E2E framework.
- Run the project's TypeScript check after editing TS/TSX files when available.
