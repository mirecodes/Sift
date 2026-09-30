import type { FocusSession, PlacedAnimal, Settings, WorldState } from '../../domain/types';
import type { StoredPhase } from '../../domain/timer/phase';

export interface PersistedState {
  settings?: Settings;
  world?: WorldState;
  /** `undefined` means idle. */
  phase?: StoredPhase;
  animals: PlacedAnimal[];
  sessions: FocusSession[];
}

/** Everything that must change together. An implementation applies it in one transaction. */
export interface Commit {
  session?: FocusSession;
  animal?: PlacedAnimal;
  /** The new active phase; `idle` clears the stored one. */
  phase?: StoredPhase;
}

export interface StorageAdapter {
  load(): Promise<PersistedState>;
  saveSettings(settings: Settings): Promise<void>;
  saveWorld(world: WorldState): Promise<void>;
  /** Replaces the world and deletes every placed animal, in one transaction. */
  resetWorld(world: WorldState): Promise<void>;
  commit(change: Commit): Promise<void>;
}
