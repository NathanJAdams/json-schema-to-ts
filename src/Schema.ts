type SchemaEnum = Set<null | boolean | number | string>;

interface SchemaLocation {
  relativeDir: string;
  file: string;
}

interface Schema {
  $id?: string;
  type?: string;
  $ref?: string;
  enum?: SchemaEnum;
  items?: Schema[];
  uniqueItems?: boolean;
  allOf?: Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  properties?: Map<string, Schema>;
  additionalProperties?: boolean | Schema;
  required?: Set<string>;
  definitions?: Map<string, Schema>;
}

const parse = (files: Map<string, string>): Map<string, Schema> => {
  const schemas: Map<string, Schema> = new Map();
  files.forEach((content: string, file: string) => {
    const schema: Schema = JSON.parse(content);
    schemas.set(file, schema);
  });
  return schemas;
};

export {
  SchemaEnum,
  SchemaLocation,
  Schema,
  parse,
};
