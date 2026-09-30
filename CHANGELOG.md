# CHANGELOG.md

> Notable changes to Sift ([Keep a Changelog](https://keepachangelog.com/), [SemVer](https://semver.org/)).
> Maintained by the coding agent. Newest first, each entry stamped `YYYY-MM-DD HH:MM`; move entries into a version section on release.
> When a change deletes something, ~~strike through~~ the earlier entry it removes.
> Categories: `Added`, `Changed`, `Removed`, `Fixed`, `Docs`.

---

## [Unreleased]

- 2026-09-30 · **Changed** — Home wheel zoom limit raised from 1.4× to 2.1× (1.5× closer) so the island can be inspected in more detail.

- 2026-09-30 · **Changed** — Hut is now a forest log cabin about 1.5 blocks wide: stacked-log walls, stepped wooden gable roof, stone chimney with night smoke, framed door and glowing window; the animals' door approach point moved with it.

- 2026-09-30 · **Fixed** — Stream bends (including the last tile before the rim fall) are clean quarter circles of radius 0.5 instead of corner-cut polylines that pinched the ribbon into a zigzag.

- 2026-09-30 · **Fixed** — Stream end: the water now ends at the first rim tile it reaches (after at least 4 tiles) and falls straight ahead, or turns once toward the most outward open side, instead of staircasing along the rim.

- 2026-09-30 · **Fixed** — Stream bank: where a bed tile's side is exposed (island rim or a lower neighbor) the bank now has a skirt down to the bed block, so it no longer looks like a thin floating sheet from the side.

- 2026-09-30 · **Added** — Stream spring: the water starts in a round pool with a fountain of white droplets bursting up (ADR-021).
- 2026-09-30 · **Changed** — Stream bank is a smooth mesh that follows the curved water edge (grass top, grassy lip, dirt wall) instead of blocks (ADR-021).

- 2026-09-30 · **Fixed** — Stream: flicker on curved sections (opaque water, ribbon narrows on tight bends so it never overlaps itself); everything beside the water is now filled with grass following the curved channel instead of a square notch (ADR-021).

- 2026-09-30 · **Changed** — Stream: seed-picked winding chord across the island, falls outward over the rim instead of following the boundary, stream tiles replace natural terrain (no raised banks), water is 0.7 wide with grass strips filling the tile margins at the surrounding height (ADR-021).

- 2026-09-30 · **Added** — Winding stream: seeded meander, bed and banks cut into the terrain, curved water at every level step and at the island rim, white splash particles at the landings, animals kept off water (ADR-020).

- 2026-09-30 · **Added** — `resetMapOnStart` option in `config/app.yaml`: new island seed and no placed animals on every start (ADR-019).

- 2026-09-30 · **Changed** — Terrain generation: terraced warped noise with plains, hills and lowlands, a weak back-high tilt, and flat ground around the camp (ADR-018).

- 2026-09-30 · **Changed** — Terrain: base island 7×7 and near-circular; terrain levels 1–3 are 0.5 block each; hut moved to (-2,0), one block from the campfire, door facing it (ADR-017).

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
