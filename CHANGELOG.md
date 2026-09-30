# CHANGELOG.md

> Notable changes to Sift ([Keep a Changelog](https://keepachangelog.com/), [SemVer](https://semver.org/)).
> Maintained by the coding agent. Newest first, each entry stamped `YYYY-MM-DD HH:MM`; move entries into a version section on release.
> When a change deletes something, ~~strike through~~ the earlier entry it removes.
> Categories: `Added`, `Changed`, `Removed`, `Fixed`, `Docs`.

---

## [Unreleased]

- 2026-09-30 14:53 · **Docs** — Condensed `CHANGELOG.md` and `DECISIONS.md` (all ADRs kept); `CLAUDE.md` now requires Edit/Write for file edits.
- 2026-09-30 14:48 · **Added** — Git repository (`main`), first commit; `.gitignore` covers deps, build, env, logs, test output, editor and OS files, `*.zip`.
- 2026-09-30 · **Added** — Night mode: theme toggle (top bar, persisted), night sky, lit campfire, camp (hut + campfire on reserved tiles). Focus routines: day = animals enter the hut; night = animals sleep near it (ADR-016).
- 2026-09-30 · **Removed** — All stream logic and graphics (generation, waterfalls, splash, water pixels, tests).
- 2026-09-30 · **Added** — Heightfield terrain (1–3 blocks, higher toward the back).
- 2026-09-30 · **Added** — `config/app.yaml` with `testMode` (N random species placed in memory at startup; ADR-015).
- 2026-09-30 · **Changed** — Sift wordmark removed from top bar; island animals at 0.25x (ADR-014); camera fits the island top with 5% margin (blocks ~2x larger).
- 2026-09-29 · **Docs** — `ARCHITECTURE.md` (`sessionId`, atomic commit incl. next phase, directory tree) and `DESIGN.md` (icons, Break layout/reveal, Settings, Collection, Focus sky fade, underside) updated.
- 2026-09-29 · **Added** — ADR-001 to ADR-013 in `DECISIONS.md`.
- 2026-09-29 · **Added** — 164 Vitest tests and a Playwright smoke test (`npm run e2e`).
- 2026-09-29 · **Added** — M6 polish: Collection (stats, silhouettes), Settings, responsive grid, reduced motion.
- 2026-09-29 · **Added** — M5 animals: 20 voxel species (9 common, 6 epic, 4 legendary, 1 mythic), idle behaviors, reward reveal with tier chimes.
- 2026-09-29 · **Added** — M4 Focus immersion: dimmed island, large timer, overtime badge, hold-to-stop, fullscreen + wake lock, 24fps throttle, end chime.
- 2026-09-29 · **Added** — M3 voxel world: isometric canvas, deterministic monotone island growing with animal count, clouds, camera rig.
- 2026-09-29 · **Added** — M2 rewards: 25 min minimum, 60 min cap, interpolated tier odds, injectable RNG, single-transaction commit.
- 2026-09-29 · **Added** — M1 timer core: phase state machine, derived overtime/break-over, persisted phase and settings.
- 2026-09-29 · **Added** — Scaffold: Vite, React 18, strict TypeScript, Vitest, Zustand, Dexie, three.js + r3f, platform adapters.
