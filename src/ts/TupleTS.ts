import { TS, TSType } from '.';
import { ComplexTS } from './ComplexTS';

interface TupleTS extends ComplexTS {
  tsType: TSType.TUPLE;
  elementTypes: TS[];
}

export {
  TupleTS
};
