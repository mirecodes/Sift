import { describe, expect, it } from 'vitest';
import { config } from '../../domain/config';
import { generateIsland, levelTop } from '../../domain/island/island';
import { bankMesh, buildStreamMesh, surfaceY } from './streamMesh';

const seeds = [1, 2, 3, 42, 99];

describe('bankMesh', () => {
  it('fills the bed tiles at the surrounding height and leaves the water uncovered', () => {
    for (const seed of seeds) {
      for (const run of generateIsland(seed, 0).streams) {
        const mesh = buildStreamMesh(run);
        const bank = bankMesh(run, mesh);
        expect(bank.indices.length).toBeGreaterThan(0);
        expect(bank.positions.every(Number.isFinite)).toBe(true);
        const tops = new Set(run.map((t) => levelTop(t.level) + 0.5));
        const beds = new Set(run.map((t) => levelTop(t.level) + 0.5 - config.stream.bedDepth));
        for (let i = 0; i < bank.positions.length / 3; i++) {
          const [x, y, z] = [bank.positions[i * 3]!, bank.positions[i * 3 + 1]!, bank.positions[i * 3 + 2]!];
          // Every vertex is on a bank surface, a wall or the bed, inside one of the run's tiles.
          expect(run.some((t) => Math.abs(t.x - x) <= 0.5 + 1e-6 && Math.abs(t.z - z) <= 0.5 + 1e-6)).toBe(true);
          const onLevel = [...tops, ...beds].some((h) => Math.abs(h - y) < 1e-6) || [...tops].some((h) => Math.abs(h - config.stream.bedDepth * 0 - 0.07 - y) < 1e-6);
          expect(onLevel).toBe(true);
        }
        // Top-face vertices (normal up) stay clear of the water centerline.
        for (let i = 0; i < bank.positions.length / 3; i++) {
          if (bank.normals[i * 3 + 1] !== 1) continue;
          for (const p of mesh.points) {
            expect(Math.hypot(bank.positions[i * 3]! - p[0], bank.positions[i * 3 + 2]! - p[2])).toBeGreaterThan(0.09);
          }
        }
        // The ribbon never gets wider than configured.
        expect(Math.max(...mesh.halves)).toBeLessThanOrEqual(config.stream.width / 2 + 1e-9);
      }
    }
  });
});

describe('buildStreamMesh', () => {
  it('builds a finite ribbon with a spring, a splash at every level step and one at the rim', () => {
    for (const seed of seeds) {
      for (const run of generateIsland(seed, 0).streams) {
        const m = buildStreamMesh(run);
        expect(m.positions.every(Number.isFinite)).toBe(true);
        const steps = run.filter((t, i) => run[i + 1] && run[i + 1]!.level < t.level).length;
        expect(m.splashes.filter((s) => s.kind === 'landing')).toHaveLength(steps);
        expect(m.splashes.filter((s) => s.kind === 'rim')).toHaveLength(1);
        const [spring] = m.splashes.filter((s) => s.kind === 'spring');
        expect([spring!.x, spring!.z]).toEqual([run[0]!.x, run[0]!.z]);
        // The water never rises above the highest surface of the run, and the rim fall goes below the lowest.
        const ys = Array.from({ length: m.positions.length / 3 }, (_, i) => m.positions[i * 3 + 1]!);
        expect(Math.max(...ys)).toBeLessThanOrEqual(surfaceY(Math.max(...run.map((t) => t.level))) + 1e-6);
        expect(Math.min(...ys)).toBeLessThan(surfaceY(1) - 1);
      }
    }
  });
});
