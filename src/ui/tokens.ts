import type { Tier } from '../domain/config';

/** Mirror of tokens.css for the few places that need values in JS (e.g. canvas drawing). */
export const colors = {
  primary: '#080808',
  onPrimary: '#ffffff',
  canvas: '#ffffff',
  hairline: '#d8d8d8',
  ink: '#080808',
  muteSoft: '#ababab',
  accentPurple: '#7a3dff',
  accentOrange: '#ff6b00',
  accentPink: '#ed52cb',
} as const;

export const motion = { fast: 150, base: 300, slow: 600, scene: 1000 } as const;

export const tierFill: Record<Tier, string> = {
  common: colors.canvas,
  epic: colors.accentPurple,
  legendary: colors.accentOrange,
  mythic: colors.accentPink,
};
