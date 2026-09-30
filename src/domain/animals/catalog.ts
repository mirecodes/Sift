import type { Tier } from '../config';

export interface AnimalSpecies {
  id: string;
  name: string;
  tier: Tier;
  /** Key into the voxel model registry (`src/assets/voxels`). */
  modelId: string;
  idleAnimation: 'default' | 'flop' | 'sparkle' | 'rainbow' | 'flutter';
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
  s('butterfly', 'Butterfly', 'common', 'flutter'),
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
  // Mythic (second tier, blue)
  s('sheep', 'Sheep', 'mythic'),
  s('pig', 'Pig', 'mythic'),
  s('cat', 'Cat', 'mythic'),
  s('dog', 'Dog', 'mythic'),
  s('goat', 'Goat', 'mythic'),
  s('raccoon', 'Raccoon', 'mythic'),
  s('penguin', 'Penguin', 'mythic'),
  s('owl', 'Owl', 'mythic'),
  s('otter', 'Otter', 'mythic'),
  s('beaver', 'Beaver', 'mythic'),
  s('capybara', 'Capybara', 'mythic'),
  s('axolotl', 'Axolotl', 'mythic'),
  s('parrot', 'Parrot', 'mythic'),
  s('koala', 'Koala', 'mythic'),
  // Epic (third tier, pink)
  s('horse', 'Horse', 'epic'),
  s('cow', 'Cow', 'epic'),
  s('deer', 'Deer', 'epic'),
  s('fox', 'Fox', 'epic'),
  s('wolf', 'Wolf', 'epic'),
  s('bear', 'Bear', 'epic'),
  s('panda', 'Panda', 'epic'),
  s('redpanda', 'Red Panda', 'epic'),
  s('peacock', 'Peacock', 'epic'),
  // Legendary, the top tier (every Legendary species has the sparkle effect; the unicorn adds rainbow bursts)
  s('unicorn', 'Unicorn', 'legendary', 'rainbow'),
  s('tiger', 'Tiger', 'legendary', 'sparkle'),
];

const BY_ID = new Map(CATALOG.map((a) => [a.id, a]));

export function getSpecies(id: string): AnimalSpecies {
  const species = BY_ID.get(id);
  if (!species) throw new Error(`Unknown animal species: ${id}`);
  return species;
}

export const speciesByTier = (tier: Tier): AnimalSpecies[] => CATALOG.filter((a) => a.tier === tier);
