import { Schema } from '../..';
import { CollectionTS, CollectionType, TS, TSType } from '../../ts';
import { convert, SchemaConverter } from '..';
import { convertDefinitions } from './convert';

const collectionConverter: SchemaConverter<CollectionTS> = (schema: Schema): CollectionTS | undefined => {
  const type: string | undefined = schema.type;
  if (type !== undefined && type !== 'array') {
    return undefined;
  }
  const items: Schema[] | undefined = schema.items;
  if (items === undefined || items.length !== 1) {
    return undefined;
  }
  const elementSchema: Schema = items[0];
  const elementType: TS | undefined = convert(elementSchema);
  if (elementType === undefined) {
    return undefined;
  }
  const collectionType: CollectionType = (schema.uniqueItems)
    ? CollectionType.SET
    : CollectionType.ARRAY;
  const definitions: Map<string, TS> | undefined = convertDefinitions(schema.definitions);
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
