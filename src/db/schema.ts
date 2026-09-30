import Dexie, { type EntityTable } from 'dexie';
import type { FocusSession, PlacedAnimal } from '../domain/types';

export interface KvRow {
  key: 'settings' | 'world' | 'phase';
  value: unknown;
}

/**
 * Schema versions:
 *  1: kv (settings, world, active phase), sessions, animals.
 *  2: the Legendary and Mythic tier names were swapped (ADR-026); stored animals are renamed.
 *  3: the Epic and Mythic tier names were swapped (ADR-027); stored animals are renamed.
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
    this.version(2)
      .stores({})
      .upgrade((tx) =>
        tx
          .table('animals')
          .toCollection()
          .modify((a: { tier: string }) => {
            // Version 1 stored the top tier as 'mythic' and the one below as 'legendary'.
            if (a.tier === 'legendary') a.tier = 'mythic';
            else if (a.tier === 'mythic') a.tier = 'legendary';
          }),
      );
    this.version(3)
      .stores({})
      .upgrade((tx) =>
        tx
          .table('animals')
          .toCollection()
          .modify((a: { tier: string }) => {
            // Version 2 called the second tier 'epic' and the third 'mythic' (ADR-027 swaps them back in rank).
            if (a.tier === 'epic') a.tier = 'mythic';
            else if (a.tier === 'mythic') a.tier = 'epic';
          }),
      );
  }
}
