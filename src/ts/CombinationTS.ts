import { TS, TSType } from '.';
import { ComplexTS } from './ComplexTS';

interface CombinationTS extends ComplexTS {
  tsType: TSType.COMBINATION;
  intersectionTypesAllOf?: TS[];
  unionTypesAnyOf?: TS[];
  unionTypesOneOf?: TS[];
}

export {
  CombinationTS
};
