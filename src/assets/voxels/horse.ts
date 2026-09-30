import { defineModel } from './builder';

// Horse: chestnut body, long legs, dark mane, tail and hooves.
export const horse = defineModel([3, 9, 6], {
  1: '#A0522D', // coat
  2: '#3B2416', // mane, tail, hooves
  3: '#1E1E1E', // eye
  4: '#C97A4A', // muzzle
}, (b) => {
  b.boxM(0, 0, 1, 1, 3, 1, 1); // hind legs
  b.boxM(0, 0, 4, 1, 3, 1, 1); // front legs
  b.boxM(0, 0, 1, 1, 1, 1, 2); // hooves
  b.boxM(0, 0, 4, 1, 1, 1, 2);
  b.box(0, 3, 1, 3, 3, 4, 1); // body
  b.box(0, 5, 4, 3, 3, 2, 1); // neck and head
  b.box(0, 5, 5, 3, 1, 1, 4); // muzzle
  b.box(1, 6, 3, 1, 3, 1, 2); // mane
  b.set(1, 8, 4, 2); // forelock
  b.boxM(0, 8, 4, 1, 1, 1, 1); // ears
  b.setM(0, 7, 5, 3); // eyes
  b.box(1, 2, 0, 1, 4, 1, 2); // tail
});
