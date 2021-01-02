type SchemaPrimitive = null | boolean | number | string;

type SchemaEnum = Set<SchemaPrimitive>;

interface Schema {
  $id?: string;
  type?: string;
  $ref?: string;
  enum?: SchemaEnum;
  items?: Schema | Schema[];
  uniqueItems?: boolean;
  allOf?: Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  properties?: Map<string, Schema>;
  required?: Set<string>;
  definitions?: Map<string, Schema>;
}

export {
  SchemaPrimitive,
  SchemaEnum,
  Schema
};
