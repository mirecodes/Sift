import { config, TIERS, type Tier } from '../config';
import { CATALOG, speciesByTier, type AnimalSpecies } from '../animals/catalog';
import { clamp, lerp, type Rng } from '../random';

export function isEligible(effectiveMs: number): boolean {
  return effectiveMs >= config.reward.minFocusMs;
}

/** Tier probabilities for an effective focus time. Always sums to 1. */
export function tierProbabilities(effectiveMs: number): Record<Tier, number> {
  const { minFocusMs, maxFocusMs, tierAtMin, tierAtMax } = config.reward;
  const t = clamp((effectiveMs - minFocusMs) / (maxFocusMs - minFocusMs), 0, 1);
  const out = {} as Record<Tier, number>;
  for (const tier of TIERS) out[tier] = lerp(tierAtMin[tier], tierAtMax[tier], t);
  return out;
}

export function rollTier(effectiveMs: number, rng: Rng): Tier {
  const p = tierProbabilities(effectiveMs);
  const r = rng();
  let acc = 0;
  for (const tier of TIERS) {
    acc += p[tier];
    if (r < acc) return tier;
  }
  return 'common'; // floating-point remainder
}

export function pickSpecies(tier: Tier, rng: Rng): AnimalSpecies {
  const pool = speciesByTier(tier);
  const species = pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
  return species ?? (CATALOG[0] as AnimalSpecies);
}

/** Returns the earned species, or `undefined` when the focus was too short. */
export function rollReward(effectiveMs: number, rng: Rng): AnimalSpecies | undefined {
  if (!isEligible(effectiveMs)) return undefined;
  return pickSpecies(rollTier(effectiveMs, rng), rng);
}
