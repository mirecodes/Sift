import { defineModel } from './builder';

// Butterfly: big symmetric orange wings with sky-blue tails and white spots.
export const butterfly = defineModel([5, 4, 5], {
  1: '#FF9A3C', // upper wings
  2: '#7EC8FF', // lower wings
  3: '#1E1E1E', // body, antennae
  4: '#FFFFFF', // wing spots
}, (b) => {
  b.boxM(0, 1, 1, 2, 3, 3, 1); // upper wings
  b.boxM(0, 0, 0, 2, 1, 2, 2); // lower wings
  b.setM(0, 2, 2, 4); // spots
  b.box(2, 0, 0, 1, 2, 5, 3); // body
  b.box(2, 2, 4, 1, 1, 1, 3); // head
  b.setM(1, 2, 4, 3); // antennae
});
