import { Schema } from '../schema';
import { filteredJoin } from '../util';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const collectionGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.type || schema.type !== 'array' || !schema.items || Array.isArray(schema.items)) {
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
  const isSet: boolean = schema.uniqueItems ? true : false;
  const prefix: string | undefined = (isSet) ? 'Set<' : undefined;
  const suffix: string = (isSet) ? '>' : '[]';
  return filteredJoin([prefix, inlinedElementType, suffix]);
};

export {
  collectionGenerator
};
