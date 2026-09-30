# DECISIONS.md

> Philosophy and architecture decision records (ADRs) for Sift.
> Maintained by the coding agent. Never delete an ADR; supersede it with a new one.

---

## Philosophy

1. **Focus is the product; rewards are the garnish.**
2. **Protect the cycle.** Focus → break → focus flows with no friction and no interruptions.
3. **Honest time.** The timer is always correct; rewards come only from real, completed focus.
4. **Gentle motivation.** Longer focus is rewarded slightly more, never dramatically. No punishment beyond "no reward".
5. **A world that grows with you.** The island is a quiet record of accumulated effort.
6. **Build once, ship everywhere.** Web first; platform dependencies isolated so mobile is a wrapper, not a rewrite.

---

## ADR Template

```md
## ADR-XXX: Title
- Date: YYYY-MM-DD
- Status: Proposed | Accepted | Superseded by ADR-YYY
- Context: Why this decision was needed.
- Decision: What was decided.
- Consequences: Trade-offs and follow-up work.
```

---

## Records

> **Status.** `Accepted` = settled. `Proposed` = a default was applied so work could continue; the owner should confirm or pick another option. To change one, mark it `Superseded by ADR-XXX` and add a new record.

## ADR-001: Styling with CSS Modules
- Date: 2026-09-29
- Status: Proposed
- Context: ARCHITECTURE.md §3 left "CSS Modules or Tailwind" open; DESIGN.md forbids hard-coded values outside the token set.
- Decision: CSS Modules + CSS custom properties (`var(--…)`). Tailwind rejected: tokens would need mirroring and arbitrary values bypass DESIGN.md.
- Consequences: Styles live in `*.module.css` next to components; switching later rewrites those files, not the tokens.

## ADR-002: Mobile milestone (M7) deferred
- Date: 2026-09-29
- Status: Proposed
- Context: M7 (Capacitor, native adapters, notifications) needs Xcode/Android Studio and can't be verified here.
- Decision: Implement M1–M6; keep all platform dependencies behind `platform/` adapters so M7 is only new `native.ts` files. No Capacitor stubs yet.
- Consequences: `platform/*/index.ts` interfaces are complete (incl. `scheduleFocusEnd`, `HapticsAdapter`); web implementations only.

## ADR-003: Session id on focus phases; overtime/break-over are derived
- Date: 2026-09-29
- Status: Accepted
- Context: §7.1 listed `focusOvertime`/`breakOver` in `Phase` yet called overtime derived; ending focus must be atomic (§7.3).
- Decision: Persist only `idle`, `focus`, `break`. `resolvePhase(phase, now)` derives the rest. `focus` carries a `sessionId`. Ending focus writes session, animal, and next phase in one transaction, so a crash can't grant a reward twice.
- Consequences: ARCHITECTURE.md §7.1 updated.

## ADR-004: Open questions Q1–Q11 resolved with documented assumptions
- Date: 2026-09-29
- Status: Proposed
- Context: ARCHITECTURE.md §13 lists open questions, each with an assumption.
- Decision: All applied as written: Fish is Common (Q1); probability anchors 60/28/10/2 → 50/32/14/4 (Q2); animals slowed on Focus (Q3); no auto-start after break (Q4); only end-of-focus chime (Q5); no long breaks (Q6); automatic placement (Q7); animals only (Q8); simple stats in Collection (Q9); local only, UUIDs and epoch ms (Q10); Capacitor later (Q11, ADR-002).
- Consequences: Supersede to change; all numbers live in `src/domain/config.ts`.

## ADR-005: Every animal occupies one tile; idle movement stays inside it
- Date: 2026-09-29
- Status: Proposed
- Context: §5.4 has a per-species `footprint`; §6.4 lists "moving one tile". Walking across tiles needs live collision handling and would disagree with stored coordinates.
- Decision: Footprint 1×1 for all; models ≤ 6 voxels wide/deep; idle = turn, hop, small shuffles in the own tile. Rejected: 2×1 large animals and inter-tile walking.
- Consequences: Placement = "pick an empty tile". `footprint` stays in the catalog for later.

## ADR-006: Sounds synthesized with Web Audio, no audio files
- Date: 2026-09-29
- Status: Proposed
- Context: DESIGN.md §9 wants short, soft chimes; no licensable assets exist.
- Decision: Synthesize chimes (sine partials, exponential decay) in `platform/notify/web.ts`. `src/assets/sounds/` is not created.
- Consequences: Native can reuse the tones or use scheduled notification sounds.

## ADR-007: Reward preview rendering
- Date: 2026-09-29
- Status: Proposed
- Context: DESIGN.md §7.3 wants a rotating model in the reward card, §7.5 silhouettes in Collection; ARCHITECTURE.md §12 wants one persistent world canvas.
- Decision: The Break reward card hosts one small transparent `<Canvas>` only while visible. Collection draws a 2D front-view pixel sprite per model on `<canvas>`, solid black for silhouettes. Rejected: shared canvas with scissor views (complex, little benefit).
- Consequences: The world canvas is never remounted.

## ADR-008: Terrain blocks are flat-colored cubes
- Date: 2026-09-29
- Status: Proposed
- Context: §6.5 says blocks are "defined like animals"; DESIGN.md §14.2 gives only top and side colors.
- Decision: Unit cube with per-face vertex colors, one `InstancedMesh` per block type, ±4% deterministic brightness tint per position. Animals keep the voxel format.
- Consequences: Far fewer triangles (100 animals ≈ 1,500 instances × 12 triangles).

## ADR-009: Custom camera rig; `@react-three/drei` not installed
- Date: 2026-09-29
- Status: Accepted
- Context: Camera must fit the island with 15% margin and re-fit on growth, allow limited rotation/zoom on Home only, pull back over 1s into Focus, and jump under `prefers-reduced-motion`. `OrbitControls` fights all four.
- Decision: A small `CameraRig` drives position, azimuth, and zoom with damping. No drei.
- Consequences: drei remains allowed by ARCHITECTURE.md if a real need appears.

## ADR-010: "Browser APIs only in `platform/`" means capability APIs
- Date: 2026-09-29
- Status: Accepted
- Context: ARCHITECTURE.md §10, read literally, would include DOM events and `Date.now`.
- Decision: The rule covers capability APIs that differ or don't exist on native: storage, wake lock, fullscreen, audio/notifications, haptics. Event handlers, `visibilitychange`, `matchMedia`, `Date.now` are fine in `ui/`, `screens/`, `world/`. `domain/` stays free of all of them; time is injected as `now()`.

## ADR-011: Break screen layout and reveal choreography
- Date: 2026-09-29
- Status: Proposed
- Context: DESIGN.md §7.3 lists Break contents but not arrangement or reveal timeline (ARCHITECTURE.md §4.3: "3–5s, skippable").
- Decision: One `panel` (card, eyebrow, timer, buttons): bottom-center on narrow screens, right-aligned and centered from 992px up. Card fades in over `--motion-slow`, model spins, tier chime plays; after 3.5s (or tap/click, Enter/Space) the animal appears. Buttons work immediately. DESIGN.md §7.3 updated.
- Consequences: Tune with `config.ui.revealMs`.

## ADR-012: Short planned focus times never earn a reward on their own
- Date: 2026-09-29
- Status: Proposed
- Context: Settings allow 5–60 min focus but a reward needs ≥ 25 min effective time; overtime can still qualify.
- Decision: Keep both rules; the no-reward message already explains the 25 min rule. Alternatives (clamp minimum to 25, or hint on Home) remain one-line changes (`config.settings.focusMinutes.min`).

## ADR-013: Island growth is shown when returning Home
- Date: 2026-09-29
- Status: Accepted
- Context: §6.3 wants the growth animation on returning Home; §15.3 says new animals appear only at Break reveal.
- Decision: During `break`/`breakOver` with a reward, size the island from `animals.length - 1` and place the new animal on a tile in that smaller island. On Home, size from all animals; new blocks scale in over 700ms. Islands are monotone (a tile at side `s` exists at every larger side), so stored coordinates stay valid.
- Consequences: Unit test covers monotonicity.

## ADR-014: Animal world scale 0.25x; camera fits the island top
- Date: 2026-09-30
- Status: Accepted (requested by the owner)
- Context: Animals were about one block wide and the whole island, underside included, was fitted to the screen, making blocks small.
- Decision: `config.render.animalScale` (0.25) applies in the world only; models, footprint, and reward card unchanged. Camera fits the top surface plus `undersideFit` (35%) with a 5% margin.
- Consequences: Animals roam wider (shuffle ±0.35); the underside may be cropped. Tune `animalScale`, `undersideFit`, `fitMargin` in `config.ts`.

## ADR-015: YAML runtime config with a test mode
- Date: 2026-09-30
- Status: Accepted (requested by the owner)
- Context: Test-only switches belong in a config file, not code.
- Decision: `config/app.yaml` is imported with Vite `?raw` and parsed with `yaml` in `src/app/runtimeConfig.ts` (outside pure `domain/`). `testMode.enabled` adds `speciesCount` random species in memory at startup in `init`, never stored. Reward rules untouched. Enabled by default for now.
- Consequences: Values are bundled at build time. Set `enabled: false` before release.

## ADR-016: Night mode, camp (hut + campfire) and Focus routines
- Date: 2026-09-30
- Status: Proposed
- Context: Owner asked for a dark-mode toggle (night sky, lit campfire) and a hut where animals go when Focus starts (inside by day, sleeping nearby by night); details were open.
- Decision (see DESIGN.md 15.4):
  - `Settings.theme` (`light` | `dark`) persisted; toggle in the top bar (Home, Settings, Collection).
  - Campfire on tile (0,0) and 1-tile hut on (-1,0), door facing +z, always present (cold fire pit in light mode); both excluded from animal placement. Animals previously saved there will visually overlap.
  - Routine is chosen by theme at Focus start; theme can't change during Focus.
  - Night Focus overlay is lighter (0.6 vs 0.82).
- Alternatives: hide pit/hut in light mode; 2-tile hut; pathfinding around obstacles (animals walk straight lines and may clip the hut).
- Consequences: Simple, with reserved tiles; pathfinding can come later.
