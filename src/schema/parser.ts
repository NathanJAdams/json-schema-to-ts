import { RawSchema } from './RawSchema';
import { Schema, SchemaEnum } from '.';
import { FileLocation } from '../files';

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
  const _enum: SchemaEnum | undefined = parseEnum(rawSchema);
  const items: Schema | Schema[] | undefined = parseItems(rawSchema);
  const allOf: Schema[] | undefined = parseArray(rawSchema.allOf);
  const anyOf: Schema[] | undefined = parseArray(rawSchema.anyOf);
  const oneOf: Schema[] | undefined = parseArray(rawSchema.oneOf);
  const properties: Map<string, Schema> | undefined = parseRecord(rawSchema.properties);
  const required: Set<string> | undefined = parseRequired(rawSchema);
  const definitions: Map<string, Schema> | undefined = parseRecord(rawSchema.definitions);
  return {
    ...rawSchema,
    enum: _enum,
    items,
    allOf,
    anyOf,
    oneOf,
    properties,
    required,
    definitions
  };
};

const parseEnum = (rawSchema: RawSchema): SchemaEnum | undefined => {
  if (!rawSchema.enum) {
    return undefined;
  }
  return new Set(rawSchema.enum);
};

const parseItems = (rawSchema: RawSchema): Schema | Schema[] | undefined => {
  if (!rawSchema.items) {
    return undefined;
  }
  if (Array.isArray(rawSchema.items)) {
    return rawSchema.items.map(parseSchema);
  }
  return parseSchema(rawSchema.items);
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

const parseRequired = (rawSchema: RawSchema): Set<string> | undefined => {
  if (!rawSchema.required) {
    return undefined;
  }
  return new Set(rawSchema.required);
};

export {
  parse
};
