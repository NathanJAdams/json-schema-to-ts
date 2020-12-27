import { TS, TSType } from '.';

enum PrimitiveType {
  NULL = 'null',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  STRING = 'string'
}

interface PrimitiveTS extends TS {
  tsType: TSType.PRIMITIVE;
  primitiveType: PrimitiveType;
}

export {
  PrimitiveType,
  PrimitiveTS
};
