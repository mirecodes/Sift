/**
 * Every tunable number in the app. `domain/` imports nothing outside itself,
 * so this file is plain data. Change values here only.
 */

export type Tier = 'common' | 'epic' | 'legendary' | 'mythic';

export const TIERS: readonly Tier[] = ['common', 'epic', 'legendary', 'mythic'];

const MINUTE = 60_000;

export const config = {
  reward: {
    /** Minimum effective focus time that earns a reward. */
    minFocusMs: 25 * MINUTE,
    /** Effective focus time is capped here. */
    maxFocusMs: 60 * MINUTE,
    /** Tier probabilities at the minimum and at the cap; linearly interpolated between. */
    tierAtMin: { common: 0.6, epic: 0.28, legendary: 0.1, mythic: 0.02 } as Record<Tier, number>,
    tierAtMax: { common: 0.5, epic: 0.32, legendary: 0.14, mythic: 0.04 } as Record<Tier, number>,
  },
  settings: {
    focusMinutes: { default: 25, min: 5, max: 60, step: 5 },
    breakMinutes: { default: 5, min: 1, max: 30, step: 1 },
    soundEnabled: true,
  },
  island: {
    minSide: 5,
    /** Grass tiles requested per animal (includes free space). */
    tilesPerAnimal: 3,
    /** Every tile within this many tiles of the center is preferred for placement. */
    placementCenterBias: 0.35,
    /** Depth of the inverted pyramid: the center column is about `coneSlope × half-width` layers deep. */
    coneSlope: 1.6,
    /** Chance that a column with 3+ layers ends one layer early (natural gaps). */
    columnShortenChance: 0.25,
    /** Max random inset of the rounded-square outline, in tiles. */
    outlineJitter: 0.45,
  },
  ui: {
    holdToAbandonMs: 1500,
    controlsVisibleMs: 3000,
    /** Reveal length before the new animal joins the island. */
    revealMs: 3500,
    /** Display tick; never the source of truth for time. */
    tickMs: 250,
    /** A chime is only played if the threshold was crossed this recently. */
    chimeFreshMs: 3000,
  },
  render: {
    /** Frame rate cap on the Focus screen. */
    focusFps: 24,
    /** Animal idle animation speed on the Focus screen. */
    focusAnimalTimeScale: 0.25,
    /** Island growth animation length. */
    growthMs: 700,
    /** Camera transition between screens (matches --motion-scene). */
    sceneMs: 1000,
    /** Island bobbing. */
    bobPeriodS: 5,
    bobAmplitude: 0.12,
    /** Fit margin around the island. */
    fitMargin: 0.05,
    /** Share of the island underside included when fitting the camera. */
    undersideFit: 0.35,
    /** World scale of animals relative to their 1/6-block voxel models. */
    animalScale: 0.25,
    /** Home camera limits. */
    azimuthLimitDeg: 30,
    zoomMin: 0.8,
    zoomMax: 1.4,
    /** Focus camera pull-back factor (zoom multiplier). */
    focusZoomFactor: 0.88,
    maxPixelRatio: 2,
  },
} as const;
