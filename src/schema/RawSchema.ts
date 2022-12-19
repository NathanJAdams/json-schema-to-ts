import { SchemaPrimitive } from '.';

export type RawSchema = {
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
  $defs?: Record<string, RawSchema>;
  definitions?: Record<string, RawSchema>;
}
