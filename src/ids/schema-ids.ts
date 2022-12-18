export type AbsoluteSchemaId = {
  authority: string;
  folder: string;
  name: string;
};

export type RelativeSchemaId = {
  folder: string;
  name: string;
};

export type SchemaId = AbsoluteSchemaId | RelativeSchemaId;

export const isAbsoluteSchemaId = (schemaId: SchemaId): schemaId is AbsoluteSchemaId =>
  (schemaId as AbsoluteSchemaId).authority !== undefined;

export const isRelativeSchemaId = (schemaId: SchemaId): schemaId is RelativeSchemaId =>
  !isAbsoluteSchemaId(schemaId);
