import type { Tier } from './config';

export type { Tier };

export interface Settings {
  focusMinutes: number;
  breakMinutes: number;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface FocusSession {
  id: string;
  startedAt: number; // epoch ms
  plannedFocusMs: number;
  endedAt?: number;
  effectiveFocusMs?: number; // planned + overtime, capped
  status: 'running' | 'completed' | 'abandoned';
  rewardAnimalId?: string; // PlacedAnimal.id
}

export interface PlacedAnimal {
  id: string;
  speciesId: string; // catalog id
  tier: Tier;
  tileX: number; // relative to island center
  tileZ: number;
  acquiredAt: number;
  sessionId: string;
}

export interface WorldState {
  seed: number; // island shape seed, generated once
}
