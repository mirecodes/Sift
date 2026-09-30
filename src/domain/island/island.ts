import { config } from '../config';
import { clamp, hash01, type Rng } from '../random';

export interface Tile {
  x: number;
  z: number;
}

export type BlockKind = 'grass' | 'dirt' | 'stone';

export interface Block extends Tile {
  /** Terrain top is `Cell.top`; layers go down from there, `-depth` is the lowest. */
  y: number;
  kind: BlockKind;
}

/** A surface tile with its height. `top` is the y of the topmost block (0..2). */
export interface Cell extends Tile {
  top: number;
}

export interface IslandLayout {
  side: number;
  /** Surface tiles, relative to the island center. */
  tiles: Cell[];
  blocks: Block[];
  /** Number of layers below y = 0. */
  depth: number;
  /** Highest `top` on the island (extra headroom above y = 0). */
  rise: number;
}

/** Top side length: max(5, ceil(sqrt(animals × 3))), rounded up to odd. */
export function islandSide(animalCount: number): number {
  const required = Math.max(0, animalCount) * config.island.tilesPerAnimal;
  const side = Math.max(config.island.minSide, Math.ceil(Math.sqrt(required)));
  return side % 2 === 0 ? side + 1 : side;
}

/**
 * Distance of a tile from the center with a rounded-square metric plus a seeded
 * jitter. Independent of the island size, which makes shapes monotone: a tile
 * present at one side length is present at every larger one.
 */
const roundedRadius = (x: number, z: number): number => (Math.abs(x) ** 4 + Math.abs(z) ** 4) ** 0.25;

function outlineScore(seed: number, x: number, z: number): number {
  return roundedRadius(x, z) + hash01(seed, x, z, 1) * config.island.outlineJitter;
}

const key = (t: Tile): string => `${t.x},${t.z}`;

export function isTile(seed: number, side: number, x: number, z: number): boolean {
  const h = (side - 1) / 2;
  if (Math.abs(x) > h || Math.abs(z) > h) return false;
  return outlineScore(seed, x, z) <= h + 0.5;
}

function outlineTiles(seed: number, side: number): Tile[] {
  const h = (side - 1) / 2;
  const tiles: Tile[] = [];
  for (let z = -h; z <= h; z++) {
    for (let x = -h; x <= h; x++) {
      if (isTile(seed, side, x, z)) tiles.push({ x, z });
    }
  }
  return tiles;
}


/** Surface tiles with heights. */
export function islandTiles(seed: number, side: number): Cell[] {
  return buildTerrain(seed, side);
}

/** Camp tiles are always this many blocks high (top y = CAMP_LEVEL - 1). */
export const CAMP_LEVEL = 2;

/** 2D gradient noise in [-1, 1] (Perlin-style, seeded by hashed gradient angles). */
function gradientNoise(seed: number, x: number, z: number): number {
  const x0 = Math.floor(x);
  const z0 = Math.floor(z);
  const fx = x - x0;
  const fz = z - z0;
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const corner = (ix: number, iz: number, dx: number, dz: number) => {
    const a = hash01(seed, ix, iz, 501) * Math.PI * 2;
    return Math.cos(a) * dx + Math.sin(a) * dz;
  };
  const u = fade(fx);
  const v = fade(fz);
  const top = corner(x0, z0, fx, fz) * (1 - u) + corner(x0 + 1, z0, fx - 1, fz) * u;
  const bottom = corner(x0, z0 + 1, fx, fz - 1) * (1 - u) + corner(x0 + 1, z0 + 1, fx - 1, fz - 1) * u;
  return (top * (1 - v) + bottom * v) * 1.41;
}

/** Fractal noise (3 octaves) with domain warping, so ridges bend instead of following the grid. */
function fbm(seed: number, x: number, z: number): number {
  const wx = x + gradientNoise(seed + 1, x * 0.2, z * 0.2) * 2;
  const wz = z + gradientNoise(seed + 2, x * 0.2, z * 0.2) * 2;
  let sum = 0;
  let amp = 1;
  let freq = 0.22;
  let norm = 0;
  for (let o = 0; o < 3; o++) {
    sum += gradientNoise(seed + 10 + o, wx * freq, wz * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

/** Terrain level 1..3 at any coordinate (uncarved). Higher toward the back of the screen (-x, -z). */
export function terrainLevel(seed: number, x: number, z: number): number {
  if ((x === FIRE_TILE.x && z === FIRE_TILE.z) || (x === HUT_TILE.x && z === HUT_TILE.z)) return CAMP_LEVEL;
  const raw = 2 + 0.28 * -(x + z) + 0.8 * fbm(seed, x, z);
  return clamp(Math.round(raw), 1, 3);
}

function buildTerrain(seed: number, side: number): Cell[] {
  return outlineTiles(seed, side).map((t) => ({ ...t, top: terrainLevel(seed, t.x, t.z) - 1 }));
}

/** Deterministic: same seed and animal count always give the same island. */
export function generateIsland(seed: number, animalCount: number): IslandLayout {
  const side = islandSide(animalCount);
  const h = (side - 1) / 2;
  const tiles = buildTerrain(seed, side);
  const blocks: Block[] = [];
  let depth = 0;
  let rise = 0;

  for (const { x, z, top } of tiles) {
    // Depth follows the smooth radius (no jitter) so the pyramid tip is never hidden behind the rim.
    const maxDepth = Math.ceil(config.island.coneSlope * h) + 1;
    let layers = 1 + Math.floor(((h + 0.5 - roundedRadius(x, z)) / (h + 0.5)) * maxDepth);
    const isCenter = x === 0 && z === 0;
    if (!isCenter && layers >= 3 && hash01(seed, x, z, 2) < config.island.columnShortenChance) layers -= 1;
    depth = Math.max(depth, layers);
    rise = Math.max(rise, top);

    blocks.push({ x, z, y: top, kind: 'grass' });
    for (let y = top - 1; y >= -layers; y--) {
      const k = top - y;
      const stoneChance = k === 1 ? 0 : Math.min(0.85, 0.25 + 0.2 * (k - 1));
      const kind: BlockKind = hash01(seed, x, z, 10 + k) < stoneChance ? 'stone' : 'dirt';
      blocks.push({ x, z, y, kind });
    }
  }
  return { side, tiles, blocks, depth, rise };
}

/**
 * Picks a random empty tile, weighted toward the center. Returns `undefined`
 * only if the island is completely full.
 */
/** Campfire (center) and hut (behind-left of it). Animals are never placed here. */
export const FIRE_TILE: Tile = { x: 0, z: 0 };
export const HUT_TILE: Tile = { x: -1, z: 0 };
const RESERVED: readonly Tile[] = [FIRE_TILE, HUT_TILE];

export function pickPlacementTile(tiles: readonly Tile[], occupied: readonly Tile[], rng: Rng): Tile | undefined {
  const taken = new Set([...occupied, ...RESERVED].map(key));
  const free = tiles.filter((t) => !taken.has(key(t)));
  if (free.length === 0) return undefined;

  const bias = config.island.placementCenterBias;
  const weights = free.map((t) => 1 / (1 + bias * (t.x * t.x + t.z * t.z)));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < free.length; i++) {
    r -= weights[i] as number;
    if (r < 0) return free[i];
  }
  return free[free.length - 1];
}
