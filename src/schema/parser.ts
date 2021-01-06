import { RawSchema } from './RawSchema';
import { Schema, SchemaEnum } from '.';
import { FileLocation } from '../files';
import { SchemaPrimitive } from './Schema';

const parse = (files: Map<FileLocation, string>): Map<FileLocation, Schema> => {
  const schemas: Map<FileLocation, Schema> = new Map();
  files.forEach((content: string, fileLocation: FileLocation) => {
    const rawSchema: RawSchema = JSON.parse(content);
    const schema: Schema = parseSchema(rawSchema);
    schemas.set(fileLocation, schema);
  });
  return schemas;
};

const parseSchema = (rawSchema: RawSchema): Schema => {
  const type: Set<string> | undefined = parseType(rawSchema.type);
  const _enum: SchemaEnum | undefined = parseEnum(rawSchema.enum);
  const items: Schema | Schema[] | undefined = parseItems(rawSchema.items);
  const additionalItems: false | Schema | undefined = parseAdditional(rawSchema.additionalItems);
  const allOf: Schema[] | undefined = parseArray(rawSchema.allOf);
  const anyOf: Schema[] | undefined = parseArray(rawSchema.anyOf);
  const oneOf: Schema[] | undefined = parseArray(rawSchema.oneOf);
  const properties: Map<string, Schema> | undefined = parseRecord(rawSchema.properties);
  const additionalProperties: false | Schema | undefined = parseAdditional(rawSchema.additionalProperties);
  const required: Set<string> | undefined = parseRequired(rawSchema.required);
  const defs: Map<string, Schema> | undefined = parseRecord(rawSchema.$defs);
  const definitions: Map<string, Schema> | undefined = parseRecord(rawSchema.definitions);
  if (defs && definitions) {
    defs?.forEach((schema: Schema, key: string) => {
      definitions?.set(key, schema);
    });
  }
  return {
    ...rawSchema,
    type,
    enum: _enum,
    items,
    additionalItems,
    allOf,
    anyOf,
    oneOf,
    properties,
    additionalProperties,
    required,
    definitions: (definitions) ? definitions : defs
  };
};

const parseType = (type?: string | string[]): Set<string> | undefined => {
  if (!type) {
    return undefined;
  }
  if (typeof type === 'string') {
    const set: Set<string> = new Set();
    set.add(type);
    return set;
  } else {
    return new Set(type);
  }
};

const parseEnum = (_enum?: SchemaPrimitive[]): SchemaEnum | undefined => {
  if (!_enum) {
    return undefined;
  }
  return new Set(_enum);
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

const parseAdditional = (additional?: false | RawSchema): false | Schema | undefined => {
  if (!additional) {
    return additional;
  }
  return parseSchema(additional);
};

const parseArray = (array?: RawSchema[]): Schema[] | undefined => {
  if (!array) {
    return undefined;
  }
  return array.map(parseSchema);
};

const parseRecord = (record?: Record<string, RawSchema>): Map<string, Schema> | undefined => {
  if (!record) {
    return undefined;
  }
  const parsed: Map<string, Schema> = new Map();
  for (const key in record) {
    const rawSchema: RawSchema = record[key];
    const schema: Schema = parseSchema(rawSchema);
    parsed.set(key, schema);
  }
  return parsed;
};

const parseRequired = (required?: string[]): Set<string> | undefined => {
  if (!required) {
    return undefined;
  }
  return new Set(required);
};

export {
  parse
};
