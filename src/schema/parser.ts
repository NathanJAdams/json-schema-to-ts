import { RawSchema } from './RawSchema';
import { Schema, SchemaEnum } from '.';
import { FileLocation } from '../files';
import { isBasicType, SchemaBasicType, SchemaCollection, SchemaObject, SchemaPrimitive } from './Schema';
import { parseSchemaId, parseSchemaRef } from '../ids';

export const parse = (files: Map<FileLocation, string>): Map<FileLocation, Schema> => {
  const schemas: Map<FileLocation, Schema> = new Map();
  files.forEach((content: string, fileLocation: FileLocation) => {
    const rawSchema: RawSchema = JSON.parse(content);
    const schema = parseSchema(rawSchema);
    schemas.set(fileLocation, schema);
  });
  return schemas;
};

const parseSchema = (rawSchema: RawSchema): Schema => {
  const $id = parseSchemaId(rawSchema.$id);
  const type = parseType(rawSchema.type);
  const $ref = parseSchemaRef(rawSchema.$ref);
  const _enum = parseEnum(rawSchema.enum);
  const object = parseObject(rawSchema);
  const collection = parseCollection(rawSchema);
  const allOf = parseArray(rawSchema.allOf);
  const anyOf = parseArray(rawSchema.anyOf);
  const oneOf = parseArray(rawSchema.oneOf);
  const defs = parseRecord(rawSchema.$defs);
  const definitions = parseRecord(rawSchema.definitions);
  if (defs && definitions) {
    defs?.forEach((schema: Schema, key: string) => {
      definitions?.set(key, schema);
    });
  }
  return {
    $id,
    type,
    $ref,
    enum: _enum,
    object,
    collection,
    allOf,
    anyOf,
    oneOf,
    definitions: definitions ? definitions : defs,
  };
};

const parseType = (type?: string | string[]): Set<SchemaBasicType> | undefined => {
  if (!type) {
    return undefined;
  }
  const typeArray = (typeof type === 'string')
    ? [type]
    : type;
  return new Set(typeArray.filter(isBasicType));
};

const parseEnum = (_enum?: SchemaPrimitive[]): SchemaEnum | undefined =>
  _enum
    ? new Set(_enum)
    : undefined;

const parseObject = (rawSchema: RawSchema): SchemaObject | undefined => {
  const properties = parseRecord(rawSchema.properties);
  const additionalProperties = parseAdditional(rawSchema.additionalProperties);
  const required = parseRequired(rawSchema.required);
  return (properties)
    ? {
      properties,
      additionalProperties,
      required
    }
    : undefined;
};

const parseCollection = (rawSchema: RawSchema): SchemaCollection | undefined => {
  const items = parseItems(rawSchema.items);
  const additionalItems = parseAdditional(rawSchema.additionalItems);
  const uniqueItems = rawSchema.uniqueItems;
  return (items)
    ? {
      items,
      additionalItems,
      uniqueItems
    }
    : undefined;
};

const parseItems = (items?: RawSchema | RawSchema[]): Schema | Schema[] | undefined => {
  if (!items) {
    return undefined;
  }
  if (Array.isArray(items)) {
    return items.map(parseSchema);
  }
  return parseSchema(items);
};

const parseAdditional = (additional?: false | RawSchema): Schema | undefined =>
  additional
    ? parseSchema(additional)
    : undefined;

const parseArray = (array?: RawSchema[]): Schema[] | undefined =>
  array
    ? array.map(parseSchema)
    : undefined;

const parseRecord = (record?: Record<string, RawSchema>): Map<string, Schema> | undefined => {
  if (!record) {
    return undefined;
  }
  const parsed: Map<string, Schema> = new Map();
  for (const key in record) {
    const rawSchema = record[key];
    const schema = parseSchema(rawSchema);
    parsed.set(key, schema);
  }
  return parsed;
};

const parseRequired = (required?: string[]): Set<string> => new Set(required || []);
