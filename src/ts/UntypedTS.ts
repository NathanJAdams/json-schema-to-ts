import { TSType } from '.';
import { ComplexTS } from './ComplexTS';

enum UntypedType {
  ANY = 'any',
  UNDEFINED = 'undefined',
  UNKNOWN = 'unknown'
}

interface UntypedTS extends ComplexTS {
  tsType: TSType.UNTYPED;
  untypedType: UntypedType;
}

export {
  UntypedType,
  UntypedTS
};
