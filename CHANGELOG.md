# CHANGELOG.md

> All notable changes to Sift. Format based on [Keep a Changelog](https://keepachangelog.com/); versioning follows [SemVer](https://semver.org/).
> Maintained by the coding agent. Add entries under `Unreleased`; move them into a version section on release.

Categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Docs`.

---

## [Unreleased]

### Added
- Project scaffold: Vite, React 18, strict TypeScript, Vitest, Zustand, Dexie, three.js + @react-three/fiber, self-hosted Inter and Inconsolata.
- **M1 timer core:** phase state machine with derived overtime/break-over, persisted phase and settings, `visibilitychange`-safe clock.
- **M2 rewards:** 25 min minimum, 60 min cap, interpolated tier probabilities, injectable RNG, atomic commit of session + animal + next phase.
- **M3 voxel world:** persistent isometric canvas, floating island with deterministic monotone shape and growth animation, clouds, camera rig (fit margin, limited rotation, zoom on Home).
- **M4 Focus immersion:** dimmed island, large timer, overtime badge, hold-to-stop, auto-hiding controls, fullscreen and wake lock, 24fps throttle, one end chime.
- **M5 animals:** 20 voxel species (9 common, 6 epic, 4 legendary, 1 mythic) with idle behaviors; Break reward reveal with tier chimes and rotating model.
- **M6 polish:** Collection (stats, silhouettes), Settings, responsive layouts, reduced-motion support.
- Platform adapters: storage, wake lock, fullscreen, notify (Web Audio), haptics.
- Tests: 164 Vitest tests and a Playwright smoke test (`npm run e2e`).
- `config/app.yaml` via `src/app/runtimeConfig.ts` with `testMode`: N random species (default 4) on the island at startup, in memory only (ADR-015).
- Night mode: theme toggle, night sky, lit campfire; hut and campfire on reserved center tiles. Focus routines: day = animals enter the hut, night = they sleep near it. `Settings.theme` persisted (ADR-016).
- Heightfield terrain (1–3 blocks, higher toward the back).
- Git repository initialized (`main`); `.gitignore` extended.

### Changed
- Removed the `Sift` wordmark from the top bar.
- Island animals render at 0.25x; reward card unchanged (ADR-014).
- Camera fits the island top plus 35% of the underside with a 5% margin (blocks about 2x larger).

### Removed
- All stream logic and graphics (streams, waterfalls, splash particles, water pixels, tests).

### Docs
- `ARCHITECTURE.md`: `sessionId` on focus phases, atomic commit includes next phase, directory structure.
- `DESIGN.md`: icons, Break layout and reveal, Settings/Collection details, Focus sky fade, island underside.
- ADR-001 to ADR-016 in `DECISIONS.md`.
