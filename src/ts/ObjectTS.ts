import { TS, TSType } from '.';
import { ComplexTS } from './ComplexTS';

interface ObjectTS extends ComplexTS {
  tsType: TSType.OBJECT;
  fields: Map<string, TS>;
}

export {
  ObjectTS
};
