import { describe, expect, it } from 'vitest';
import { TIERS } from '../config';
import { getSpecies } from '../animals/catalog';
import { isEligible, pickSpecies, rollReward, rollTier, tierProbabilities } from './reward';

const MIN = 60_000;
const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

describe('eligibility', () => {
  it('needs at least 25 minutes', () => {
    expect(isEligible(25 * MIN - 1)).toBe(false);
    expect(isEligible(25 * MIN)).toBe(true);
    expect(rollReward(24 * MIN, () => 0)).toBeUndefined();
  });
});

describe('tierProbabilities', () => {
  it('matches the anchors', () => {
    expect(tierProbabilities(25 * MIN)).toEqual({ common: 0.6, epic: 0.28, legendary: 0.1, mythic: 0.02 });
    const max = tierProbabilities(60 * MIN);
    expect(max.common).toBeCloseTo(0.5);
    expect(max.mythic).toBeCloseTo(0.04);
  });

  it('interpolates linearly and always sums to 1', () => {
    for (let m = 0; m <= 90; m += 0.5) expect(sum(tierProbabilities(m * MIN))).toBeCloseTo(1, 10);
    const mid = tierProbabilities(42.5 * MIN);
    expect(mid.common).toBeCloseTo(0.55);
    expect(mid.legendary).toBeCloseTo(0.12);
  });

  it('clamps beyond the cap', () => {
    expect(tierProbabilities(600 * MIN)).toEqual(tierProbabilities(60 * MIN));
  });
});

describe('rollTier', () => {
  it('walks the cumulative distribution', () => {
    const at25 = 25 * MIN;
    expect(rollTier(at25, () => 0)).toBe('common');
    expect(rollTier(at25, () => 0.59)).toBe('common');
    expect(rollTier(at25, () => 0.61)).toBe('epic');
    expect(rollTier(at25, () => 0.89)).toBe('legendary');
    expect(rollTier(at25, () => 0.99)).toBe('mythic');
    expect(rollTier(at25, () => 0.999999)).toBe('mythic');
  });

  it('is statistically close to the distribution', () => {
    let seed = 12345;
    const rng = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const counts: Record<string, number> = { common: 0, epic: 0, legendary: 0, mythic: 0 };
    const n = 50_000;
    for (let i = 0; i < n; i++) counts[rollTier(60 * MIN, rng)]! += 1;
    const p = tierProbabilities(60 * MIN);
    for (const t of TIERS) expect(counts[t]! / n).toBeCloseTo(p[t], 1);
  });
});

describe('pickSpecies', () => {
  it('always returns a species of the requested tier', () => {
    for (const tier of TIERS) {
      for (const r of [0, 0.3, 0.999999]) expect(pickSpecies(tier, () => r).tier).toBe(tier);
    }
  });

  it('mythic is the unicorn or the tiger', () => {
    expect(pickSpecies('mythic', () => 0).id).toBe('unicorn');
    expect(pickSpecies('mythic', () => 0.99).id).toBe('tiger');
    expect(getSpecies('fish').tier).toBe('common');
  });
});
