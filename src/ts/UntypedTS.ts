import { TS, TSType } from '.';

enum UntypedType {
  ANY = 'any',
  UNDEFINED = 'undefined',
  UNKNOWN = 'unknown'
}

interface UntypedTS extends TS {
  tsType: TSType.UNTYPED;
  untypedType: UntypedType;
}

export {
  UntypedType,
  UntypedTS
};
