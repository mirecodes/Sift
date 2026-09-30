# DECISIONS.md

> Philosophy and ADRs for Sift. Maintained by the coding agent. Never delete an ADR; supersede it with a new one.
> `Accepted` = settled. `Proposed` = default applied, owner should confirm or pick another option.

## Philosophy

1. **Focus is the product; rewards are the garnish.**
2. **Protect the cycle.** Focus → break → focus, no friction.
3. **Honest time.** The timer is always correct; rewards come only from real, completed focus.
4. **Gentle motivation.** Longer focus rewards slightly more; no punishment beyond "no reward".
5. **A world that grows with you.** The island records accumulated effort.
6. **Build once, ship everywhere.** Web first; platform code isolated so mobile is a wrapper.

## ADR Template

```md
## ADR-XXX: Title
- Date: YYYY-MM-DD
- Status: Proposed | Accepted | Superseded by ADR-YYY
- Context / Decision / Consequences
```

## Records

## ADR-001: Styling with CSS Modules
- Date: 2026-09-29 · Status: Proposed
- Decision: CSS Modules + CSS custom properties (over Tailwind) so `tokens.css` stays the single source and DESIGN.md is hard to bypass.
- Consequences: Styles live in `*.module.css` beside components.

## ADR-002: Mobile milestone (M7) deferred
- Date: 2026-09-29 · Status: Proposed
- Decision: Build M1–M6; keep all platform dependencies behind `platform/` adapters so M7 (Capacitor) only adds `native.ts` files. No untested native stubs.
- Consequences: Adapter interfaces are complete; web implementations only.

## ADR-003: Session id on focus phases; overtime/break-over derived
- Date: 2026-09-29 · Status: Accepted
- Decision: Persist only `idle`, `focus`, `break`. `resolvePhase(phase, now)` derives `focusOvertime`/`breakOver`. Focus carries a `sessionId`; ending focus writes session, animal and next phase in one transaction (no double rewards).
- Consequences: ARCHITECTURE.md §7.1 updated.

## ADR-004: Open questions Q1–Q11 use documented assumptions
- Date: 2026-09-29 · Status: Proposed
- Decision: Fish is Common; odds 60/28/10/2 → 50/32/14/4; animals slowed on Focus; no auto-start after break; end-of-focus chime only; no long breaks; automatic placement; animals only; simple stats; local-only, UUID ids, epoch-ms times; Capacitor later (ADR-002).
- Consequences: Supersede to change; numbers live in `src/domain/config.ts`.

## ADR-005: One tile per animal; idle movement stays in the tile
- Date: 2026-09-29 · Status: Proposed
- Decision: Footprint 1×1, models ≤ 6 voxels wide; idle = turn, hop, shuffle. (Alternative: 2×1 large animals and walking, rejected: collisions vs. stored coordinates.)
- Consequences: Placement = pick an empty tile; `footprint` kept for the future.

## ADR-006: Sounds synthesized with Web Audio
- Date: 2026-09-29 · Status: Proposed
- Decision: Sine-partial chimes with exponential decay in `platform/notify/web.ts`; no audio files.
- Consequences: Native can reuse the tones or scheduled notification sounds.

## ADR-007: Reward preview rendering
- Date: 2026-09-29 · Status: Proposed
- Decision: Break card hosts a small transparent `<Canvas>` only while visible; Collection uses 2D pixel sprites (black for silhouettes). Shared scissor canvas rejected as over-complex.
- Consequences: The persistent world canvas is never remounted.

## ADR-008: Terrain blocks are flat-colored cubes
- Date: 2026-09-29 · Status: Proposed
- Decision: Unit cube with top/side vertex colors, one `InstancedMesh` per block type, ±4% deterministic tint per instance. Animals use the voxel format.
- Consequences: ~1,500 instances × 12 triangles for a 100-animal island.

## ADR-009: Custom camera rig; no `@react-three/drei`
- Date: 2026-09-29 · Status: Accepted
- Decision: A `CameraRig` handles fit margin, re-fit on growth, limited azimuth/zoom on Home, 1s Focus pull-back and reduced-motion jump; `OrbitControls` fights all of these.
- Consequences: drei may be added when truly needed.

## ADR-010: "Browser APIs only in `platform/`" means capability APIs
- Date: 2026-09-29 · Status: Accepted
- Decision: Applies to storage, wake lock, fullscreen, audio/notifications, haptics. DOM events, `visibilitychange`, `matchMedia`, `Date.now` are allowed in `ui/`, `screens/`, `world/`. `domain/` stays free of all; time is injected as `now()`.

## ADR-011: Break screen layout and reveal choreography
- Date: 2026-09-29 · Status: Proposed
- Decision: One panel (bottom-center on narrow, right-aligned from 992px). Card fades in (`--motion-slow`), model spins, tier chime plays; after 3.5s or tap/Enter/Space the animal appears on the island. Buttons usable immediately.
- Consequences: Tune with `config.ui.revealMs`; DESIGN.md §7.3 updated.

## ADR-012: Short planned focus never earns a reward alone
- Date: 2026-09-29 · Status: Proposed
- Decision: Keep 5–60 min settings and the 25 min reward rule; the no-reward message explains it. (Alternatives: clamp min to 25; show a hint on Home.)
- Consequences: Alternatives are a one-line change (`config.settings.focusMinutes.min`).

## ADR-013: Island growth shown when returning Home
- Date: 2026-09-29 · Status: Accepted
- Decision: During Break with a reward, size the island from `animals.length - 1` and place the new animal on a tile that exists there; Home sizes from all animals and scales new blocks in over 700ms. Islands are monotone, so stored coordinates stay valid.
- Consequences: Unit test covers monotonicity.

## ADR-014: Animal world scale 0.25x; camera fits island top
- Date: 2026-09-30 · Status: Accepted (owner request)
- Decision: `config.render.animalScale` = 0.25 in the world only (models, footprint, reward card unchanged). Camera fits the top plus `undersideFit` (35%) of the underside, 5% margin.
- Consequences: Animals shuffle ±0.35; underside may be cropped. Tune in `config.ts`.

## ADR-015: YAML runtime config with a test mode
- Date: 2026-09-30 · Status: Accepted (owner request)
- Decision: `config/app.yaml` (Vite `?raw` + `yaml`, parsed in `src/app/runtimeConfig.ts`). `testMode` adds `speciesCount` random species in memory at startup, never stored; rewards untouched. Enabled by default for now.
- Consequences: Bundled at build time; set `enabled: false` before release.

## ADR-016: Night mode, camp (hut + campfire), Focus routines
- Date: 2026-09-30 · Status: Proposed
- Decision (DESIGN.md 15.4): persisted `Settings.theme` (`light`|`dark`) with a top-bar toggle. Campfire on (0,0), hut on (-1,0) facing +z, always present and excluded from animal placement (older saved animals may overlap). Theme at Focus start picks the routine (day: into the hut; night: sleep nearby); theme is locked during Focus. Night Focus overlay 0.6 vs 0.82.
- Consequences: Straight-line paths may clip the hut; pathfinding later. Rejected: hiding hut/pit in light mode, 2-tile hut.
