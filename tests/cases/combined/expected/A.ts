import { B } from './B';
import { C } from './abc/C';
import { D } from './D';
import { F } from './abc/E';

export type A = {
  b: B;
  c: C;
  d: D;
  fLocal: F;
  fAbsoluteCorrect: F;
  fAbsoluteIncorrect: unknown;
};
