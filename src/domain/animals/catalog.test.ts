import { describe, expect, it } from 'vitest';
import { CATALOG, getSpecies, speciesByTier } from './catalog';

describe('catalog', () => {
  it('has 20 unique species split 9 / 6 / 4 / 1', () => {
    expect(CATALOG).toHaveLength(20);
    expect(new Set(CATALOG.map((a) => a.id)).size).toBe(20);
    expect(speciesByTier('common')).toHaveLength(9);
    expect(speciesByTier('epic')).toHaveLength(6);
    expect(speciesByTier('legendary')).toHaveLength(4);
    expect(speciesByTier('mythic')).toHaveLength(1);
  });

  it('marks the special idle animations', () => {
    expect(getSpecies('fish').idleAnimation).toBe('flop');
    expect(getSpecies('unicorn').idleAnimation).toBe('sparkle');
  });

  it('throws on unknown ids', () => {
    expect(() => getSpecies('dragon')).toThrow();
  });
});
