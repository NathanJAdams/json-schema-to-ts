import { filteredJoin } from '../util';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const collectionGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  if (!schema.type || !schema.type.has('array') || !schema.items || Array.isArray(schema.items)) {
    return undefined;
  }
  const itemsLocatedSchema: LocatedSchema = {
    fileLocation: locatedSchema.fileLocation,
    schema: schema.items
  };
  const inlinedElementType = typeGenerator(itemsLocatedSchema, gatheredInfo, inputInfo);
  if (!inlinedElementType) {
    return undefined;
  }
  const isSet = !!schema.uniqueItems;
  const prefix = isSet
    ? 'Set<'
    : undefined;
  const suffix = isSet
    ? '>'
    : '[]';
  return filteredJoin([prefix, inlinedElementType, suffix]);
};

export {
  collectionGenerator
};
