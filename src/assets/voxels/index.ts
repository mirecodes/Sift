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
import { snail } from './snail';
import { ladybug } from './ladybug';
import { bee } from './bee';
import { butterfly } from './butterfly';
import { beetle } from './beetle';
import { turtle } from './turtle';
import { crab } from './crab';
import { starfish } from './starfish';
import { mole } from './mole';
import { sparrow } from './sparrow';
import { pigeon } from './pigeon';
import { hen } from './hen';
import { guineapig } from './guineapig';
import { lizard } from './lizard';
import { bat } from './bat';
import { ferret } from './ferret';
import { penguin } from './penguin';
import { owl } from './owl';
import { otter } from './otter';
import { beaver } from './beaver';
import { capybara } from './capybara';
import { axolotl } from './axolotl';
import { parrot } from './parrot';
import { koala } from './koala';
import { wolf } from './wolf';
import { bear } from './bear';
import { panda } from './panda';
import { redpanda } from './redpanda';
import { peacock } from './peacock';
import { tiger } from './tiger';

/** Keyed by `AnimalSpecies.modelId` (which equals the species id). */
export const voxelModels: Readonly<Record<string, VoxelModel>> = {
  chick, rabbit, duck, hamster, squirrel, hedgehog, mouse, frog, fish,
  snail, ladybug, bee, butterfly, beetle, turtle, crab, starfish,
  mole, sparrow, pigeon, hen, guineapig, lizard, bat, ferret,
  sheep, pig, cat, dog, goat, raccoon,
  penguin, owl, otter, beaver, capybara, axolotl, parrot, koala,
  horse, cow, deer, fox,
  wolf, bear, panda, redpanda, peacock,
  unicorn, tiger,
};

export type { VoxelModel, Voxel } from './types';
