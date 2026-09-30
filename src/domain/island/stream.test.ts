import { describe, expect, it } from 'vitest';
import { seededRng } from '../random';
import { FIRE_TILE, generateIsland, HUT_TILE, isTile, islandTiles, levelTop, pickPlacementTile, terrainLevel } from './island';

const seeds = [1, 2, 3, 42, 99, 12345, ...Array.from({ length: 80 }, (_, i) => i * 104729 + 5)];

describe('stream', () => {
  it('is deterministic and differs between seeds', () => {
    expect(generateIsland(7, 0).streams).toEqual(generateIsland(7, 0).streams);
    expect(generateIsland(1, 100).streams).not.toEqual(generateIsland(2, 100).streams);
  });

  it('is a connected, downhill path that keeps clear of the camp', () => {
    for (const seed of seeds) {
      for (const run of generateIsland(seed, 100).streams) {
        run.forEach((t, i) => {
          for (const camp of [FIRE_TILE, HUT_TILE]) expect(Math.hypot(t.x - camp.x, t.z - camp.z)).toBeGreaterThanOrEqual(1.5);
          const next = run[i + 1];
          if (!next) return;
          expect(Math.abs(next.x - t.x) + Math.abs(next.z - t.z)).toBe(1);
          expect(next.level).toBeLessThanOrEqual(t.level);
        });
      }
    }
  });

  it('is long enough on the smallest island, and falls outward off the rim', () => {
    for (const seed of seeds) {
      const [run] = generateIsland(seed, 0).streams;
      expect(run!.length).toBeGreaterThanOrEqual(4);
      const last = run![run!.length - 1]!;
      // The fall goes over a missing tile, pointing away from the center (never along the boundary).
      expect(isTile(seed, 7, last.x + last.dx, last.z + last.dz)).toBe(false);
      expect(last.dx * last.x + last.dz * last.z).toBeGreaterThan(0);
    }
  });

  it('replaces natural terrain: the stream tiles keep their level and no bank is raised or cut', () => {
    for (const seed of seeds) {
      const { tiles, streams } = generateIsland(seed, 100);
      const level = new Map(streams.flat().map((t) => [`${t.x},${t.z}`, t.level]));
      for (const t of tiles) {
        const water = level.get(`${t.x},${t.z}`);
        expect(t.water === true).toBe(water !== undefined);
        expect(t.top).toBe(levelTop(water ?? terrainLevel(seed, t.x, t.z)));
      }
    }
  });

  it('cuts the bed and keeps animals off it', () => {
    for (const seed of seeds) {
      const water = new Set(generateIsland(seed, 0).tiles.filter((t) => t.water).map((t) => `${t.x},${t.z}`));
      const tiles = islandTiles(seed, 7);
      const rng = seededRng(seed);
      for (let i = 0; i < 50; i++) {
        const t = pickPlacementTile(tiles, [], rng)!;
        expect(water.has(`${t.x},${t.z}`)).toBe(false);
      }
    }
  });
});
