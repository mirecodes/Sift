import { config } from '../config';
import { hash01 } from '../random';

/** One tile of the stream centerline. `level` is the terrain level of the tile (bank surface). */
export interface StreamTile {
  x: number;
  z: number;
  level: number;
  /** Flow direction toward the next tile (a unit axis step). On the last tile of a run: the way it falls off the island. */
  dx: number;
  dz: number;
}

interface Pos {
  x: number;
  z: number;
}

/** What the stream needs to know about the island; passed in so this file stays independent of `island.ts`. */
export interface StreamContext {
  /** Natural terrain level at any coordinate (1..3). */
  natural: (x: number, z: number) => number;
  /** Tiles the stream keeps at least `campClearance` away from (campfire, hut). */
  avoid: readonly Pos[];
}

const TAU = Math.PI * 2;
/** The stream starts this far from the island center, so it is on the smallest island. */
const SOURCE_RADIUS = 2.3;
const CAMP_CLEARANCE = 1.5;
/** Tiles within this radius are on every island; the stream should be at least `MIN_LENGTH` tiles long inside it. */
const SMALL_RADIUS = 3.3;
const MIN_LENGTH = 5;
/** Terrain beyond this radius is not scored (islands rarely get that big). */
const SCORE_RADIUS = 9;
const STEP = 0.2;
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

let cache: { seed: number; path: StreamTile[] } | undefined;

/** Rasterizes a wobbling chord (angle, lateral offset `s`) into a 4-connected tile path. */
function trace(seed: number, angle: number, s: number, variant: number): Pos[] {
  const c = config.stream;
  const [ux, uz] = [Math.cos(angle), Math.sin(angle)];
  const [vx, vz] = [-uz, ux];
  const p1 = hash01(seed, 1, variant, 700) * TAU;
  const p2 = hash01(seed, 2, variant, 700) * TAU;
  const t0 = -Math.sqrt(SOURCE_RADIUS ** 2 - s * s);
  const path: Pos[] = [];
  for (let t = 0; t <= c.length; t += STEP) {
    // The wobble fades in over the first blocks so the source sits at its chosen radius.
    const wobble = c.meander * Math.min(1, t / 3) * (0.7 * Math.sin(0.8 * t + p1) + 0.3 * Math.sin(1.8 * t + p2));
    const lateral = s + wobble;
    const along = t0 + t;
    const tx = Math.round(lateral * vx + along * ux);
    const tz = Math.round(lateral * vz + along * uz);
    if (path.length === 0) path.push({ x: tx, z: tz });
    // Walk to the target one axis step at a time, erasing any loop back onto the path.
    for (let n = 0; n < 4; n++) {
      const last = path[path.length - 1] as Pos;
      if (last.x === tx && last.z === tz) break;
      const step = Math.abs(tx - last.x) >= Math.abs(tz - last.z) ? { x: last.x + Math.sign(tx - last.x), z: last.z } : { x: last.x, z: last.z + Math.sign(tz - last.z) };
      const seen = path.findIndex((p) => p.x === step.x && p.z === step.z);
      if (seen >= 0) path.length = seen + 1;
      else path.push(step);
    }
  }
  return path;
}

/** Water only flows downhill: each tile takes the natural level, or the level upstream if that is lower. */
function withLevels(path: Pos[], ctx: StreamContext): StreamTile[] {
  let level = 3;
  const tiles = path.map((p) => {
    level = Math.min(level, ctx.natural(p.x, p.z));
    return { ...p, level, dx: 0, dz: 1 };
  });
  tiles.forEach((t, i) => {
    const next = tiles[i + 1];
    if (next) {
      t.dx = next.x - t.x;
      t.dz = next.z - t.z;
    } else {
      const prev = tiles[i - 1];
      if (prev) [t.dx, t.dz] = [t.x - prev.x, t.z - prev.z];
    }
  });
  return tiles;
}

/** Lower is better: no tile cut below its natural level, clear of the camp, a step or two for a fall. */
function score(seed: number, tiles: StreamTile[], ctx: StreamContext, candidate: number): number {
  let cost = hash01(seed, candidate, 0, 701);
  let drops = 0;
  tiles.forEach((t, i) => {
    if (Math.hypot(t.x, t.z) > SCORE_RADIUS) return;
    cost += 10 * (ctx.natural(t.x, t.z) - t.level);
    if (ctx.avoid.some((a) => Math.hypot(t.x - a.x, t.z - a.z) < CAMP_CLEARANCE)) cost += 1e6;
    if (i > 0 && Math.hypot(t.x, t.z) <= 3.6 && t.level < (tiles[i - 1] as StreamTile).level) drops++;
  });
  const inside = tiles.findIndex((t) => Math.hypot(t.x, t.z) > SMALL_RADIUS);
  const length = inside < 0 ? tiles.length : inside;
  // Bends on the smallest island make it wind.
  const turns = tiles.slice(0, length).filter((t, i, a) => i > 0 && (t.dx !== (a[i - 1] as StreamTile).dx || t.dz !== (a[i - 1] as StreamTile).dz)).length;
  return cost - 3 * Math.min(drops, 2) - 2 * Math.min(turns, 4) + 20 * Math.max(0, MIN_LENGTH - length);
}

/**
 * The stream is a wobbling chord across the island, flowing toward the front half (downhill on
 * average) and leaving through the rim. Among many chords the one that best follows the terrain
 * (no cuts, clear of the camp, at least one step) wins. Seed only, so it never changes as the island grows.
 */
function build(seed: number, source: StreamContext): StreamTile[] {
  if (cache?.seed === seed) return cache.path;
  // Hundreds of candidates revisit the same tiles, and the terrain noise is not cheap.
  const levels = new Map<string, number>();
  const ctx: StreamContext = {
    ...source,
    natural: (x, z) => {
      const k = `${x},${z}`;
      let level = levels.get(k);
      if (level === undefined) levels.set(k, (level = source.natural(x, z)));
      return level;
    },
  };
  let best: { cost: number; tiles: StreamTile[] } | undefined;
  let candidate = 0;
  const start = hash01(seed, 4, 0, 700);
  for (let a = 0; a < 24; a++) {
    // Chords pointing to the front (+x, +z) half plane only.
    const angle = ((a / 24 + start) % 1) * TAU;
    if (Math.cos(angle) + Math.sin(angle) < 0.3) continue;
    for (const s of config.stream.offsets) {
      // Each chord is tried with several meander phases.
      for (let v = 0; v < config.stream.variants; v++) {
        const tiles = withLevels(trace(seed, angle, s, candidate), ctx);
        const cost = score(seed, tiles, ctx, candidate++);
        if (!best || cost < best.cost) best = { cost, tiles };
      }
    }
  }
  cache = { seed, path: (best as NonNullable<typeof best>).tiles };
  return cache.path;
}

/**
 * The visible stream: the first unbroken run of path tiles that exist on the island (`onIsland`), as a
 * list of zero or one runs. The last tile is where the water leaves the island: it falls outward, over
 * whichever missing neighbor points away from the center most.
 */
export function streamRuns(seed: number, ctx: StreamContext, onIsland: (x: number, z: number) => boolean): StreamTile[][] {
  const run: StreamTile[] = [];
  for (const t of build(seed, ctx)) {
    if (onIsland(t.x, t.z)) run.push({ ...t });
    else if (run.length) break;
  }
  const last = run[run.length - 1];
  if (!last) return [];
  const open = DIRS.filter(([dx, dz]) => !onIsland(last.x + dx, last.z + dz));
  const outward = ([dx, dz]: readonly [number, number]) => dx * last.x + dz * last.z;
  const pick = open.reduce<readonly [number, number] | undefined>((b, d) => (!b || outward(d) > outward(b) ? d : b), undefined);
  if (pick) [last.dx, last.dz] = pick;
  return [run];
}
