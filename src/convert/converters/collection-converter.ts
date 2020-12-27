import { Schema } from '../..';
import { CollectionTS, CollectionType, TS, TSType } from '../../ts';
import { convert, SchemaConverter } from '..';
import { convertDefinitions } from './convert';
import { Options } from '../../Options';

const collectionConverter: SchemaConverter<CollectionTS> = (schema: Schema, options: Options): CollectionTS | undefined => {
  const type: string | undefined = schema.type;
  if (type && type !== 'array') {
    return undefined;
  }
  const items: Schema | Schema[] | undefined = schema.items;
  if (items === undefined || Array.isArray(items)) {
    return undefined;
  }
  const elementSchema: Schema = items;
  const elementType: TS | undefined = convert(elementSchema, options);
  if (elementType === undefined) {
    return undefined;
  }
  const collectionType: CollectionType = (schema.uniqueItems)
    ? CollectionType.SET
    : CollectionType.ARRAY;
  const definitions: Map<string, TS> | undefined = convertDefinitions(schema.definitions, options);
  return {
    tsType: TSType.COLLECTION,
    id: schema.$id,
    collectionType,
    elementType,
    definitions
  };
};

export {
  collectionConverter
};
