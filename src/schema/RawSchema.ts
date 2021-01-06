import { SchemaPrimitive } from '.';

interface RawSchema {
  $id?: string;
  $ref?: string;
  type?: string | string[];
  const?: null | boolean | number | string;
  enum?: SchemaPrimitive[];
  items?: RawSchema | RawSchema[];
  uniqueItems?: boolean;
  additionalItems?: false | RawSchema;
  allOf?: RawSchema[];
  anyOf?: RawSchema[];
  oneOf?: RawSchema[];
  properties?: Record<string, RawSchema>;
  additionalProperties?: false | RawSchema;
  required?: string[];
  definitions?: Record<string, RawSchema>;
}

export {
  RawSchema
};
