import { SchemaId, SchemaRef } from '../ids';

type SchemaPrimitive = null | boolean | number | string;

type SchemaEnum = Set<SchemaPrimitive>;

interface Schema {
  $id?: SchemaId;
  $ref?: SchemaRef;
  type?: Set<string>;
  const?: null | boolean | number | string;
  enum?: SchemaEnum;
  items?: Schema | Schema[];
  uniqueItems?: boolean;
  additionalItems?: false | Schema;
  allOf?: Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  properties?: Map<string, Schema>;
  additionalProperties?: false | Schema;
  required?: Set<string>;
  definitions?: Map<string, Schema>;
}

export {
  SchemaPrimitive,
  SchemaEnum,
  Schema
};
