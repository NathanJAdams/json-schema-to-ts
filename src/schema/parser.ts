import { RawRootSchema, RawSchema } from './RawSchema';
import { Schema, RootSchema, SchemaEnum } from '.';

const parseEnum = (rawSchema: RawSchema): SchemaEnum | undefined => {
  if (!rawSchema.enum) {
    return undefined;
  }
  return new Set(rawSchema.enum);
};

const parseItems = (rawSchema: RawSchema): RootSchema | RootSchema[] | undefined => {
  if (!rawSchema.items) {
    return undefined;
  }
  if (Array.isArray(rawSchema.items)) {
    return rawSchema.items.map(parseSchema);
  }
  return parseSchema(rawSchema.items);
};

const parseRequired = (rawSchema: RawSchema): Set<string> | undefined => {
  if (!rawSchema.required) {
    return undefined;
  }
  return new Set(rawSchema.required);
};

const parseArray = (array?: RawSchema[]): RootSchema[] | undefined => {
  if (!array) {
    return undefined;
  }
  return array.map(parseSchema);
};

const parseRecord = (record?: Record<string, RawSchema>): Map<string, RootSchema> | undefined => {
  if (!record) {
    return undefined;
  }
  const parsed: Map<string, RootSchema> = new Map();
  for (const key in record) {
    const rawSchema: RawSchema = record[key];
    const schema: RootSchema = parseSchema(rawSchema);
    parsed.set(key, schema);
  }
  return parsed;
};

const parseSchema = (rawSchema: RawSchema): Schema => {
  const _enum: SchemaEnum | undefined = parseEnum(rawSchema);
  const items: RootSchema | RootSchema[] | undefined = parseItems(rawSchema);
  const allOf: RootSchema[] | undefined = parseArray(rawSchema.allOf);
  const anyOf: RootSchema[] | undefined = parseArray(rawSchema.anyOf);
  const oneOf: RootSchema[] | undefined = parseArray(rawSchema.oneOf);
  const properties: Map<string, RootSchema> | undefined = parseRecord(rawSchema.properties);
  const required: Set<string> | undefined = parseRequired(rawSchema);
  return {
    ...rawSchema,
    enum: _enum,
    items,
    allOf,
    anyOf,
    oneOf,
    properties,
    required
  };
};

const parseRootSchema = (rawRootSchema: RawRootSchema): RootSchema => {
  const schema: Schema = parseSchema(rawRootSchema);
  const definitions: Map<string, RootSchema> | undefined = parseRecord(rawRootSchema.definitions);
  return {
    ...schema,
    definitions
  };
};

const parse = (files: Map<string, string>): Map<string, RootSchema> => {
  const schemas: Map<string, RootSchema> = new Map();
  files.forEach((content: string, file: string) => {
    const rawRootSchema: RawRootSchema = JSON.parse(content);
    const schema: RootSchema = parseRootSchema(rawRootSchema);
    schemas.set(file, schema);
  });
  return schemas;
};

export {
  parse
};
