import type { HapticsAdapter } from './index';

export function createWebHaptics(): HapticsAdapter {
  return { impact() {} };
}
