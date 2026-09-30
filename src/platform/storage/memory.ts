import type { FocusSession, PlacedAnimal, Settings, WorldState } from '../../domain/types';
import type { StoredPhase } from '../../domain/timer/phase';
import type { Commit, PersistedState, StorageAdapter } from './index';

/** Non-persistent adapter: used in tests and as a fallback when IndexedDB is unavailable. */
export function createMemoryStorage(): StorageAdapter {
  let settings: Settings | undefined;
  let world: WorldState | undefined;
  let phase: StoredPhase | undefined;
  const animals = new Map<string, PlacedAnimal>();
  const sessions = new Map<string, FocusSession>();

  return {
    async load(): Promise<PersistedState> {
      const state: PersistedState = {
        animals: [...animals.values()].sort((a, b) => a.acquiredAt - b.acquiredAt),
        sessions: [...sessions.values()].sort((a, b) => a.startedAt - b.startedAt),
      };
      if (settings) state.settings = { ...settings };
      if (world) state.world = { ...world };
      if (phase) state.phase = structuredClone(phase);
      return state;
    },
    async saveSettings(s) {
      settings = { ...s };
    },
    async saveWorld(w) {
      world = { ...w };
    },
    async resetWorld(w) {
      world = { ...w };
      animals.clear();
    },
    async commit(change: Commit) {
      if (change.session) sessions.set(change.session.id, structuredClone(change.session));
      if (change.animal) animals.set(change.animal.id, structuredClone(change.animal));
      if (change.phase) phase = change.phase.kind === 'idle' ? undefined : structuredClone(change.phase);
    },
  };
}
