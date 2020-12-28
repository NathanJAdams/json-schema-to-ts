import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';

const PRIMITIVE_TYPES: Map<string, string> = new Map();
PRIMITIVE_TYPES.set('null', 'null');
PRIMITIVE_TYPES.set('boolean', 'boolean');
PRIMITIVE_TYPES.set('integer', 'number');
PRIMITIVE_TYPES.set('number', 'number');
PRIMITIVE_TYPES.set('string', 'string');

const primitiveGenerator: TypeGenerator = (schema: Schema): string | undefined => (schema.type)
  ? PRIMITIVE_TYPES.get(schema.type)
  : undefined;

export {
  primitiveGenerator
};
