import { Internal } from './B';

export type A = {
  local: Internal;
  correctAuthority: Internal;
  incorrectAuthority: unknown;
};
