import { parse } from 'yaml';
import raw from '../../config/app.yaml?raw';

interface RuntimeConfig {
  testMode: { enabled: boolean; speciesCount: number };
}

const file = (parse(raw) ?? {}) as Partial<{ testMode: Partial<RuntimeConfig['testMode']> }>;

export const runtimeConfig: RuntimeConfig = {
  testMode: {
    enabled: file.testMode?.enabled === true,
    speciesCount: Math.max(1, Math.floor(file.testMode?.speciesCount ?? 4)),
  },
};
