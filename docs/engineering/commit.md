## What it does

`commit` turns a reviewed working tree into one or more scoped local commits. It classifies files before staging, splits independent changes, and leaves unrelated, ignored, disposable, generated and sensitive paths untouched.

It authorizes local commits only. A commit request does not imply push, pull request creation or history rewriting.

## When to reach for it

Type `/commit`, or let [implement](https://aihero.dev/skills-implement) hand you to it when a stable implementation is ready and the active request includes commits.

Reach for it when the remaining decision is the commit boundary. For building or reviewing the change first, use [implement](https://aihero.dev/skills-implement) or [code-review](https://aihero.dev/skills-code-review).

## Logical groups

Each independent feature, fix, refactor, docs change, config change, tooling change or test-only change gets its own reviewable commit unless the user explicitly requests one combined commit.

## Common questions

**Will it commit everything in the working tree?**

No. It inspects status and scope first, preserves existing staged work, and stages only the named logical group.

**Will it push afterward?**

No. Push and pull request creation require separate authorization.

## It's working if

- Every commit has one clear purpose.
- Unrelated and sensitive files remain unstaged.
- The final report names each short hash and every skipped path.

## Where it fits

`commit` is the local history boundary after [implement](https://aihero.dev/skills-implement) and [code-review](https://aihero.dev/skills-code-review). [ask-matt](https://aihero.dev/skills-ask-matt) routes the earlier build and review phases.
