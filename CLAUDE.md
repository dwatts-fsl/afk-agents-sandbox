# CLAUDE.md — afk-agents-sandbox

A throwaway repo for testing the AFK agent loop end to end. Small on purpose.

- Node 24, pnpm. `pnpm install`, then `pnpm verify` (typecheck + tests). Run it before you finish.
- Code in `src/`, one Vitest file per module in `test/`. Every exported function has tests.
- Work test first: write the failing test, watch it fail, then make it pass.
- Tickets are GitHub Issues in this repo; read one with `gh issue view <n>`.
- Commit with Conventional Commits. Never push, open PRs or comment on GitHub: the runner does that.
