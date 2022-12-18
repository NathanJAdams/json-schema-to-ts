import { collectionGenerator } from './collection-generator';
import { objectGenerator } from './object-generator';
import { tupleGenerator } from './tuple-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';

const PRIMITIVE_TYPES: Map<string, string> = new Map();
PRIMITIVE_TYPES.set('null', 'null');
PRIMITIVE_TYPES.set('boolean', 'boolean');
PRIMITIVE_TYPES.set('integer', 'number');
PRIMITIVE_TYPES.set('number', 'number');
PRIMITIVE_TYPES.set('string', 'string');

const basicGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schemaTypes: Set<string> | undefined = locatedSchema.schema.type;
  if (!schemaTypes || schemaTypes.size === 0) {
    return undefined;
  }
  const tsTypesSet: Set<string> = new Set();
  PRIMITIVE_TYPES.forEach((tsType: string, schemaType: string) => {
    if (schemaTypes.has(schemaType)) {
      tsTypesSet.add(tsType);
    }
  });
  const tsTypes: string[] = Array.from(tsTypesSet);
  const collectionType = collectionGenerator(locatedSchema, gatheredInfo, inputInfo);
  const tupleType = tupleGenerator(locatedSchema, gatheredInfo, inputInfo);
  const objectType = objectGenerator(locatedSchema, gatheredInfo, inputInfo);
  if (collectionType) {
    tsTypes.push(collectionType);
  }
  if (tupleType) {
    tsTypes.push(tupleType);
  }
  if (objectType) {
    tsTypes.push(objectType);
  }

  if (tsTypes.length === 0) {
    return undefined;
  }
  if (tsTypes.length === 1) {
    return tsTypes[0];
  }
  return `(${tsTypes.join(' | ')})`;
};

export {
  basicGenerator
};
