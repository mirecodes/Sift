import Dexie, { type EntityTable } from 'dexie';
import type { FocusSession, PlacedAnimal } from '../domain/types';

export interface KvRow {
  key: 'settings' | 'world' | 'phase';
  value: unknown;
}

/**
 * Schema versions:
 *  1: kv (settings, world, active phase), sessions, animals.
 * Add a new `db.version(n).stores(...)` with an `upgrade` for every change; never edit old versions.
 */
export class SiftDB extends Dexie {
  kv!: EntityTable<KvRow, 'key'>;
  sessions!: EntityTable<FocusSession, 'id'>;
  animals!: EntityTable<PlacedAnimal, 'id'>;

  constructor(name = 'sift') {
    super(name);
    this.version(1).stores({
      kv: 'key',
      sessions: 'id, startedAt',
      animals: 'id, acquiredAt',
    });
  }
}
