# CLAUDE.md

Read `docs/ARCHITECTURE.md` and `docs/DESIGN.md` before any task.

- **Work source**: the project plan arrives as `docs/guidance_vN.md`. Implement the highest-numbered guidance step by step. Everything built so far is guidance_v1.
- Write everything in English.
- All docs live in `docs/`; only `README.md` and `CLAUDE.md` stay at the root. Keep docs short and to the point.
- Log every change in `docs/CHANGELOG.md` under `## guidance_vN` for the guidance being implemented (add the section if missing).
- Update `docs/ARCHITECTURE.md` before any structural change and record settled decisions there (it is the agent's only rules source). Update `docs/DESIGN.md` before any visual change.
- `docs/DECISIONS.md` is a human-only log: append a short ADR for significant decisions, but never read it as a reference.
- If a request conflicts with the guidance, `ARCHITECTURE.md` or `DESIGN.md`, ask first.
- Edit files only with the Edit/Write tools, never via shell redirection or heredoc. Read the file first if needed.
