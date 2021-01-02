import { LocatedSchema, TypeGenerator } from './TypeGenerator';

const PRIMITIVE_TYPES: Map<string, string> = new Map();
PRIMITIVE_TYPES.set('null', 'null');
PRIMITIVE_TYPES.set('boolean', 'boolean');
PRIMITIVE_TYPES.set('integer', 'number');
PRIMITIVE_TYPES.set('number', 'number');
PRIMITIVE_TYPES.set('string', 'string');

const primitiveGenerator: TypeGenerator = (locatedSchema: LocatedSchema): string | undefined => (locatedSchema.schema.type)
  ? PRIMITIVE_TYPES.get(locatedSchema.schema.type)
  : undefined;

export {
  primitiveGenerator
};
