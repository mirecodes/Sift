import type { Tier } from '../config';

export interface AnimalSpecies {
  id: string;
  name: string;
  tier: Tier;
  /** Key into the voxel model registry (`src/assets/voxels`). */
  modelId: string;
  idleAnimation: 'default' | 'flop' | 'sparkle';
  /** Tiles occupied, [x, z]. All species are 1×1 (ADR-005). */
  footprint: readonly [number, number];
}

const s = (
  id: string,
  name: string,
  tier: Tier,
  idleAnimation: AnimalSpecies['idleAnimation'] = 'default',
): AnimalSpecies => ({ id, name, tier, modelId: id, idleAnimation, footprint: [1, 1] });

export const CATALOG: readonly AnimalSpecies[] = [
  // Common
  s('chick', 'Chick', 'common'),
  s('rabbit', 'Rabbit', 'common'),
  s('duck', 'Duck', 'common'),
  s('hamster', 'Hamster', 'common'),
  s('squirrel', 'Squirrel', 'common'),
  s('hedgehog', 'Hedgehog', 'common'),
  s('mouse', 'Mouse', 'common'),
  s('frog', 'Frog', 'common'),
  s('fish', 'Fish', 'common', 'flop'),
  s('snail', 'Snail', 'common'),
  s('ladybug', 'Ladybug', 'common'),
  s('bee', 'Bee', 'common'),
  s('butterfly', 'Butterfly', 'common'),
  s('beetle', 'Beetle', 'common'),
  s('turtle', 'Turtle', 'common'),
  s('crab', 'Crab', 'common'),
  s('starfish', 'Starfish', 'common'),
  s('mole', 'Mole', 'common'),
  s('sparrow', 'Sparrow', 'common'),
  s('pigeon', 'Pigeon', 'common'),
  s('hen', 'Hen', 'common'),
  s('guineapig', 'Guinea Pig', 'common'),
  s('lizard', 'Lizard', 'common'),
  s('bat', 'Bat', 'common'),
  s('ferret', 'Ferret', 'common'),
  // Epic
  s('sheep', 'Sheep', 'epic'),
  s('pig', 'Pig', 'epic'),
  s('cat', 'Cat', 'epic'),
  s('dog', 'Dog', 'epic'),
  s('goat', 'Goat', 'epic'),
  s('raccoon', 'Raccoon', 'epic'),
  s('penguin', 'Penguin', 'epic'),
  s('owl', 'Owl', 'epic'),
  s('otter', 'Otter', 'epic'),
  s('beaver', 'Beaver', 'epic'),
  s('capybara', 'Capybara', 'epic'),
  s('axolotl', 'Axolotl', 'epic'),
  s('parrot', 'Parrot', 'epic'),
  s('koala', 'Koala', 'epic'),
  // Legendary
  s('horse', 'Horse', 'legendary'),
  s('cow', 'Cow', 'legendary'),
  s('deer', 'Deer', 'legendary'),
  s('fox', 'Fox', 'legendary'),
  s('wolf', 'Wolf', 'legendary'),
  s('bear', 'Bear', 'legendary'),
  s('panda', 'Panda', 'legendary'),
  s('redpanda', 'Red Panda', 'legendary'),
  s('peacock', 'Peacock', 'legendary'),
  // Mythic (every Mythic species shares the sparkle effect)
  s('unicorn', 'Unicorn', 'mythic', 'sparkle'),
  s('tiger', 'Tiger', 'mythic', 'sparkle'),
];

const BY_ID = new Map(CATALOG.map((a) => [a.id, a]));

export function getSpecies(id: string): AnimalSpecies {
  const species = BY_ID.get(id);
  if (!species) throw new Error(`Unknown animal species: ${id}`);
  return species;
}

export const speciesByTier = (tier: Tier): AnimalSpecies[] => CATALOG.filter((a) => a.tier === tier);
