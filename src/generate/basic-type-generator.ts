import { SchemaBasicType } from '../schema';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';

const PRIMITIVE_TYPES: Map<SchemaBasicType, string> = new Map();
PRIMITIVE_TYPES.set('null', 'null');
PRIMITIVE_TYPES.set('boolean', 'boolean');
PRIMITIVE_TYPES.set('integer', 'number');
PRIMITIVE_TYPES.set('number', 'number');
PRIMITIVE_TYPES.set('string', 'string');

export const basicTypeGenerator: TypeGenerator = (locatedSchema: LocatedSchema, _gatheredInfo: SchemaGatheredInfo, _inputInfo: SchemaInputInfo): string | undefined => {
  const schemaTypes = locatedSchema.schema.type;
  if (!schemaTypes || schemaTypes.size === 0) {
    return undefined;
  }
  const tsTypesSet: Set<string> = new Set();
  Array.from(PRIMITIVE_TYPES.entries())
    .filter(([schemaType, _]) => schemaTypes.has(schemaType))
    .map(([_, tsType]) => tsType)
    .forEach((tsType) => tsTypesSet.add(tsType));
  const tsTypes: string[] = Array.from(tsTypesSet);
  if (tsTypes.length === 0) {
    return undefined;
  }
  if (tsTypes.length === 1) {
    return tsTypes[0];
  }
  return `(${tsTypes.join(' | ')})`;
};
