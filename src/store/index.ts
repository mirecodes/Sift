import { useStore } from 'zustand';
import { CATALOG } from '../domain/animals/catalog';
import { runtimeConfig } from '../app/runtimeConfig';
import { platform } from '../platform';
import { createAppStore, type AppState } from './appStore';

const { testMode } = runtimeConfig;
// Every species, or a random subset chosen once per page load.
const testSpecies = testMode.enabled
  ? testMode.allSpecies
    ? [...CATALOG]
    : [...CATALOG].sort(() => Math.random() - 0.5).slice(0, testMode.speciesCount)
  : undefined;

export const appStore = createAppStore({
  storage: platform.storage,
  now: () => Date.now(),
  rng: () => Math.random(),
  uuid: () => crypto.randomUUID(),
  testSpecies,
  resetMap: runtimeConfig.resetMapOnStart,
});

export function useApp<T>(selector: (state: AppState) => T): T {
  return useStore(appStore, selector);
}

export * from './appStore';
