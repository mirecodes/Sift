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

## ADR-017: Circular 7×7 island, half-block terrain levels, hut faces the fire
- Date: 2026-09-30 · Status: Accepted (owner request) · Supersedes the hut placement in ADR-016
- Decision: Minimum side 7; outline uses Euclidean distance (near-circular) instead of a rounded square. Terrain stays level 1–3 but one level is 0.5 block (`config.island.levelHeight`): a full base block plus half-height slabs. Hut on (-2,0) with one empty tile to the fire on (0,0), door facing +x toward the fire.
- Consequences: Blocks get an `h` (height) field; instances scale in y. Stored animal coordinates stay valid (shapes remain monotone), but animals saved on the new hut tile may overlap it.

## ADR-018: Terraced noise terrain with a flat camp
- Date: 2026-09-30 · Status: Accepted (owner request)
- Decision: Terrain height = domain-warped fBm + a weak back-high tilt (`config.island.terrain`), blended toward level 2 around the camp by a smoothstep, then terraced with thresholds so a wide middle band is plains and level 3 / level 1 form hills / lowlands. The back-high trend is a tendency, not a rule.
- Consequences: Still a pure per-coordinate function, so islands stay monotone and deterministic. Tests scan many seeds for flat camp surroundings and no cliffs above one level.

## ADR-020: Seed-only winding stream with curved falls and splash
- Date: 2026-09-30 · Status: Accepted (owner request) · Re-adds the stream removed earlier
- Decision (DESIGN.md 15.5): the stream path and its water levels (2 → 1 at a seeded row) depend on the seed only. Terrain around it is clamped (bed cut, banks in [L, L+1]) so tests for flat camp and ≤ 1-level cliffs still hold. The water is one smoothed ribbon mesh (Chaikin corner cutting on the tile path, parabolic falls); splash is stateless instanced cubes. Rejected: water as voxel blocks (blocky bends, no curved falls), terrain-following levels (may give no falls at all), a particle system with per-frame state.
- Consequences: Water tiles are excluded from placement; animals saved earlier may overlap water, and Focus walking paths may cross it (same limits as ADR-016). The stream needs `x ≥ 1`, so the camp flat area is untouched.

## ADR-021: Stream replaces natural terrain; chosen chord, outward rim fall, bank strips
- Date: 2026-09-30 · Status: Accepted (owner request) · Supersedes the path, level and bank rules of ADR-020
- Decision (DESIGN.md 15.5): no bank clamping or raised terrain; stream tiles are natural tiles turned into water (bed cut 0.25, level never rises downstream). The path is the best-scoring wobbling chord (seed only), so it winds, avoids the camp and does not run along the rim; at the rim the last tile falls over the missing neighbor pointing most away from the center. The water is 0.7 wide and everything else in a bed tile is filled with grass strips at the surrounding height.
- Update (same day): the bank is a mesh built in `world/stream/streamMesh.ts` from the smoothed ribbon (marching squares on a 16×16 grid per tile over the distance to the ribbon edge, plus a wall to the bed), so the channel is a smooth curve, not a square notch or voxel steps. The water is opaque and narrows on tight bends, which removed the flicker from the ribbon overlapping itself under transparency. The stream starts at a spring: a round ribbon head with a fountain of white cubes. Rejected: voxel strips (still blocky), a stencil or shader cut-out (the bank would still be a flat block face).
- Consequences: Only the first unbroken run on the island is water, so growth can extend the stream upstream. Candidate search costs ~500 traces per seed, cached per seed. The stream may be nearly straight on the smallest island when the camp leaves little room.

## ADR-019: `resetMapOnStart` runtime option
- Date: 2026-09-30 · Status: Accepted (owner request)
- Decision: `config/app.yaml` `resetMapOnStart: true` makes every app start roll a new island seed and delete all placed animals (`StorageAdapter.resetWorld`). Sessions, settings and the active phase are kept.
- Consequences: Data loss by design, for testing terrain generation; set `false` before release.
