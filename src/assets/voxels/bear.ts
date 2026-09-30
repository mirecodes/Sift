import { defineModel } from './builder';

// Bear: big heavy dark brown body, light muzzle, small round ears.
export const bear = defineModel([5, 9, 6], {
  1: '#5E3B20', // fur
  2: '#B98552', // muzzle
  3: '#1E1E1E', // eye, nose
}, (b) => {
  b.boxM(0, 0, 0, 2, 2, 2, 1); // hind legs
  b.boxM(0, 0, 4, 2, 2, 2, 1); // front legs
  b.box(0, 2, 0, 5, 4, 6, 1); // body
  b.box(0, 5, 3, 5, 3, 2, 1); // head
  b.box(1, 5, 5, 3, 2, 1, 2); // muzzle
  b.set(2, 6, 5, 3); // nose
  b.setM(1, 7, 4, 3); // eyes
  b.boxM(0, 8, 3, 1, 1, 1, 1); // ears
});
