import { SchemaId, SchemaRef } from '../ids';

const BASIC_TYPES = new Set(['string', 'number', 'integer', 'object', 'array', 'boolean', 'null']);

export type SchemaBasicType = 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean' | 'null';

export type SchemaType = Set<SchemaBasicType>;

export type SchemaPrimitive = null | boolean | number | string;

export type SchemaEnum = Set<SchemaPrimitive>;

export type SchemaObject = {
  properties: Map<string, Schema>;
  required: Set<string>;
  additionalProperties?: Schema;
}

export type SchemaCollection = {
  items: Schema | Schema[];
  additionalItems?: Schema;
  uniqueItems?: boolean;
};

export type Schema = {
  $id?: SchemaId;
  $ref?: SchemaRef;
  type?: SchemaType;
  const?: SchemaPrimitive;
  enum?: SchemaEnum;
  collection?: SchemaCollection;
  object?: SchemaObject;
  allOf?: Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  definitions?: Map<string, Schema>;
}

export const isBasicType = (type: string): type is SchemaBasicType => BASIC_TYPES.has(type);
