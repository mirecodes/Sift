import { defineModel } from './builder';

// Tiger: orange with black stripes, white muzzle and a 王-style mark on the forehead.
export const tiger = defineModel([5, 12, 6], {
  1: '#F28C28', // fur
  2: '#1E1E1E', // stripes, eyes, forehead mark
  3: '#FFFFFF', // muzzle, belly
  4: '#F4A6B7', // nose
}, (b) => {
  b.boxM(0, 0, 1, 2, 4, 2, 1); // hind legs
  b.boxM(0, 0, 3, 2, 4, 2, 1); // front legs
  b.boxM(0, 1, 1, 1, 1, 2, 2); // leg stripes
  b.boxM(0, 2, 3, 1, 1, 2, 2);
  b.box(0, 4, 1, 5, 4, 4, 1); // body
  b.box(2, 4, 1, 1, 1, 4, 3); // belly
  b.boxM(0, 5, 1, 1, 3, 1, 2); // body stripes
  b.boxM(0, 5, 3, 1, 3, 1, 2);
  b.box(0, 7, 1, 5, 1, 1, 2); // back stripe
  b.box(2, 5, 0, 1, 4, 1, 1); // tail
  b.set(2, 6, 0, 2);
  b.set(2, 8, 0, 2);
  b.box(0, 7, 3, 5, 4, 3, 1); // head
  b.box(1, 7, 5, 3, 2, 1, 3); // muzzle
  b.set(2, 8, 5, 4); // nose
  b.setM(1, 9, 5, 2); // eyes
  b.box(1, 10, 5, 3, 1, 1, 2); // forehead mark
  b.box(2, 10, 3, 1, 1, 3, 2);
  b.setM(0, 9, 4, 2); // cheek stripes
  b.boxM(0, 11, 3, 1, 1, 1, 1); // ears
});
