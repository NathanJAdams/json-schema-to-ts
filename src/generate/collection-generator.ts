import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { filteredJoin } from '../util';
import { References } from './References';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const collectionGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (!schema.type || schema.type !== 'array' || !schema.items || Array.isArray(schema.items)) {
    return undefined;
  }
  const inlinedElementType = typeGenerator(schema.items, namedSchemas, references, options, idFileLocations);
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
