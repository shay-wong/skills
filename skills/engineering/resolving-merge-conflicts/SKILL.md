---
name: resolving-merge-conflicts
description: "Use when you need to resolve an in-progress git merge/rebase conflict."
---

1. **See the current state** of the merge/rebase. Check git history, and the conflicting files.

2. **Find the primary sources** for each conflict. Understand deeply why each change was made, and what the original intent was. Read the commit messages, check the PRs, check original issues/tickets.

3. **Resolve each hunk.** Preserve both intents where possible. Distinguish additive changes from functionally incompatible behavior. If both sides change the same feature and cannot coexist, stop, explain the incompatible contracts, and ask which side to keep. Do not silently synthesize a third behavior. Otherwise choose the resolution that follows the merge's stated goal and record the trade-off. Always resolve; never `--abort`.

4. Discover the project's **automated checks** and run them, typically typecheck, then tests, then format. Fix anything the merge broke.

5. **Finish the merge/rebase.** Bind Git commands to the resolved repository. Stage only the resolved operation, then commit or continue the rebase until the operation completes.
