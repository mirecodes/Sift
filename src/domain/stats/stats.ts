import { CATALOG } from '../animals/catalog';
import type { FocusSession, PlacedAnimal } from '../types';

export interface Stats {
  focusMs: number;
  completedSessions: number;
  collectedSpecies: number;
  totalSpecies: number;
}

export function computeStats(sessions: readonly FocusSession[], animals: readonly PlacedAnimal[]): Stats {
  const completed = sessions.filter((s) => s.status === 'completed');
  return {
    focusMs: completed.reduce((sum, s) => sum + (s.effectiveFocusMs ?? 0), 0),
    completedSessions: completed.length,
    collectedSpecies: new Set(animals.map((a) => a.speciesId)).size,
    totalSpecies: CATALOG.length,
  };
}

/** `40 min`, `1 h 05 min`, `12 h 40 min`. */
export function formatDuration(ms: number): string {
  const totalMin = Math.floor(Math.max(0, ms) / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h === 0 ? `${m} min` : `${h} h ${String(m).padStart(2, '0')} min`;
}

export function countBySpecies(animals: readonly PlacedAnimal[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const a of animals) counts.set(a.speciesId, (counts.get(a.speciesId) ?? 0) + 1);
  return counts;
}
