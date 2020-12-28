type SchemaPrimitive = null | boolean | number | string;

type SchemaEnum = Set<SchemaPrimitive>;

interface SchemaLocation {
  relativeDir: string;
  file: string;
}

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
}

interface RootSchema extends Schema {
  definitions?: Map<string, Schema>;
}

export {
  SchemaPrimitive,
  SchemaEnum,
  SchemaLocation,
  Schema,
  RootSchema
};
