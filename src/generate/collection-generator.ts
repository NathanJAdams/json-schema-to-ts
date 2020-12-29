import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Options } from '../options';
import { filteredJoin } from '../util';

const collectionGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.type || schema.type !== 'array' || !schema.items || Array.isArray(schema.items)) {
    return undefined;
  }
  const inlinedElementType = typeGenerator(schema.items, namedSchemas, references, options);
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
