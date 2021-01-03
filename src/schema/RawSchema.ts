import { SchemaPrimitive } from '.';

interface RawSchema {
  $id?: string;
  type?: string;
  $ref?: string;
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
