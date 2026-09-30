import { describe, expect, it } from 'vitest';
import { CATALOG, getSpecies, speciesByTier } from './catalog';

describe('catalog', () => {
  it('has 50 unique species split 25 / 14 / 9 / 2', () => {
    expect(CATALOG).toHaveLength(50);
    expect(new Set(CATALOG.map((a) => a.id)).size).toBe(50);
    expect(speciesByTier('common')).toHaveLength(25);
    expect(speciesByTier('mythic')).toHaveLength(14);
    expect(speciesByTier('epic')).toHaveLength(9);
    expect(speciesByTier('legendary')).toHaveLength(2);
  });

  it('marks the special idle animations', () => {
    expect(getSpecies('fish').idleAnimation).toBe('flop');
    expect(getSpecies('unicorn').idleAnimation).toBe('rainbow');
    expect(getSpecies('tiger').idleAnimation).toBe('sparkle');
  });

  it('throws on unknown ids', () => {
    expect(() => getSpecies('dragon')).toThrow();
  });
});
