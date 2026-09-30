import { parse } from 'yaml';
import raw from '../../config/app.yaml?raw';

interface RuntimeConfig {
  resetMapOnStart: boolean;
  testMode: { enabled: boolean; speciesCount: number; allSpecies: boolean };
}

const file = (parse(raw) ?? {}) as Partial<{ resetMapOnStart: boolean; testMode: Partial<RuntimeConfig['testMode']> }>;

export const runtimeConfig: RuntimeConfig = {
  resetMapOnStart: file.resetMapOnStart === true,
  testMode: {
    enabled: file.testMode?.enabled === true,
    speciesCount: Math.max(1, Math.floor(file.testMode?.speciesCount ?? 4)),
    allSpecies: file.testMode?.allSpecies === true,
  },
};
