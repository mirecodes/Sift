import { describe, expect, it } from 'vitest';
import type { FocusSession, PlacedAnimal } from '../types';
import { computeStats, countBySpecies, formatDuration } from './stats';

const session = (status: FocusSession['status'], ms?: number): FocusSession => ({
  id: String(Math.random()), startedAt: 0, plannedFocusMs: 0, status,
  ...(ms === undefined ? {} : { effectiveFocusMs: ms }),
});
const animal = (speciesId: string): PlacedAnimal => ({
  id: speciesId + Math.random(), speciesId, tier: 'common', tileX: 0, tileZ: 0, acquiredAt: 0, sessionId: 's',
});

describe('stats', () => {
  it('counts only completed sessions and unique species', () => {
    const stats = computeStats(
      [session('completed', 30 * 60_000), session('abandoned', 10 * 60_000), session('running'), session('completed', 60 * 60_000)],
      [animal('chick'), animal('chick'), animal('fox')],
    );
    expect(stats).toEqual({ focusMs: 90 * 60_000, completedSessions: 2, collectedSpecies: 2, totalSpecies: 50 });
  });

  it('counts animals per species', () => {
    expect(countBySpecies([animal('chick'), animal('chick'), animal('fox')]).get('chick')).toBe(2);
  });

  it('formats durations', () => {
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(40 * 60_000)).toBe('40 min');
    expect(formatDuration(65 * 60_000)).toBe('1 h 05 min');
    expect(formatDuration(760 * 60_000)).toBe('12 h 40 min');
  });
});
