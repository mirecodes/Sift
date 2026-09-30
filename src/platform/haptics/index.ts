export interface HapticsAdapter {
  impact(strength: 'light' | 'medium'): void;
}
