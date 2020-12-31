import { RawRootSchema, RawSchema } from './RawSchema';
import { Schema, RootSchema, SchemaEnum } from '.';
import { FileLocation } from '../files';

const parse = (files: Map<FileLocation, string>): Map<FileLocation, RootSchema> => {
  const schemas: Map<FileLocation, RootSchema> = new Map();
  files.forEach((content: string, fileLocation: FileLocation) => {
    const rawRootSchema: RawRootSchema = JSON.parse(content);
    const schema: RootSchema = parseRootSchema(rawRootSchema);
    schemas.set(fileLocation, schema);
  });
  return schemas;
};

const parseRootSchema = (rawRootSchema: RawRootSchema): RootSchema => {
  const schema: Schema = parseSchema(rawRootSchema);
  const definitions: Map<string, RootSchema> | undefined = parseRecord(rawRootSchema.definitions);
  return {
    ...schema,
    definitions
  };
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

const parseRequired = (rawSchema: RawSchema): Set<string> | undefined => {
  if (!rawSchema.required) {
    return undefined;
  }
  return new Set(rawSchema.required);
};

export {
  parse
};
