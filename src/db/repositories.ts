import type { Settings, WorldState } from '../domain/types';
import type { StoredPhase } from '../domain/timer/phase';
import type { Commit, PersistedState, StorageAdapter } from '../platform/storage';
import { SiftDB } from './schema';

export function createDexieStorage(db: SiftDB = new SiftDB()): StorageAdapter {
  return {
    async load(): Promise<PersistedState> {
      const [kv, animals, sessions] = await Promise.all([
        db.kv.toArray(),
        db.animals.orderBy('acquiredAt').toArray(),
        db.sessions.orderBy('startedAt').toArray(),
      ]);
      const get = <T>(key: string): T | undefined => kv.find((r) => r.key === key)?.value as T | undefined;
      const state: PersistedState = { animals, sessions };
      const settings = get<Settings>('settings');
      const world = get<WorldState>('world');
      const phase = get<StoredPhase>('phase');
      if (settings) state.settings = settings;
      if (world) state.world = world;
      if (phase) state.phase = phase;
      return state;
    },

    async saveSettings(settings) {
      await db.kv.put({ key: 'settings', value: settings });
    },

    async saveWorld(world) {
      await db.kv.put({ key: 'world', value: world });
    },

    /** Session, animal, and active phase are written in ONE transaction (ARCHITECTURE.md 7.3). */
    async commit(change: Commit) {
      await db.transaction('rw', db.kv, db.sessions, db.animals, async () => {
        if (change.session) await db.sessions.put(change.session);
        if (change.animal) await db.animals.put(change.animal);
        if (change.phase) {
          if (change.phase.kind === 'idle') await db.kv.delete('phase');
          else await db.kv.put({ key: 'phase', value: change.phase });
        }
      });
    },
  };
}
