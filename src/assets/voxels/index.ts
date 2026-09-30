import type { VoxelModel } from './types';
import { chick } from './chick';
import { rabbit } from './rabbit';
import { duck } from './duck';
import { hamster } from './hamster';
import { squirrel } from './squirrel';
import { hedgehog } from './hedgehog';
import { mouse } from './mouse';
import { frog } from './frog';
import { fish } from './fish';
import { sheep } from './sheep';
import { pig } from './pig';
import { cat } from './cat';
import { dog } from './dog';
import { goat } from './goat';
import { raccoon } from './raccoon';
import { horse } from './horse';
import { cow } from './cow';
import { deer } from './deer';
import { fox } from './fox';
import { unicorn } from './unicorn';

/** Keyed by `AnimalSpecies.modelId` (which equals the species id). */
export const voxelModels: Readonly<Record<string, VoxelModel>> = {
  chick, rabbit, duck, hamster, squirrel, hedgehog, mouse, frog, fish,
  sheep, pig, cat, dog, goat, raccoon,
  horse, cow, deer, fox,
  unicorn,
};

export type { VoxelModel, Voxel } from './types';
