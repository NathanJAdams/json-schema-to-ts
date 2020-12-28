import { SchemaPrimitive } from '.';

interface RawSchema {
  $id?: string;
  type?: string;
  $ref?: string;
  enum?: SchemaPrimitive[];
  items?: RawSchema | RawSchema[];
  uniqueItems?: boolean;
  allOf?: RawSchema[];
  anyOf?: RawSchema[];
  oneOf?: RawSchema[];
  properties?: Record<string, RawSchema>;
  required?: string[];
}

interface RawRootSchema extends RawSchema {
  definitions?: Record<string, RawSchema>;
}

export {
  RawSchema,
  RawRootSchema
};
