export type AbsoluteSchemaRef = {
  authority: string;
  folder: string;
  name: string;
};

export type AbsoluteFragmentSchemaRef = {
  authority: string;
  folder: string;
  name: string;
  fragment: string;
};

export type RelativeSchemaRef = {
  folder: string;
  name: string;
};

export type RelativeFragmentSchemaRef = {
  folder: string;
  name: string;
  fragment: string;
};

export type LocalSchemaRef = {
  fragment: string;
};

export type SchemaRef =
  | AbsoluteSchemaRef
  | AbsoluteFragmentSchemaRef
  | RelativeSchemaRef
  | RelativeFragmentSchemaRef
  | LocalSchemaRef;

export const isAbsolute = (schemaRef: SchemaRef): schemaRef is AbsoluteSchemaRef | AbsoluteFragmentSchemaRef =>
  hasProperties(schemaRef, true, true, true);

export const isRelative = (schemaRef: SchemaRef): schemaRef is RelativeSchemaRef | RelativeFragmentSchemaRef =>
  hasProperties(schemaRef, false, true, true);

export const isLocal = (schemaRef: SchemaRef): schemaRef is LocalSchemaRef =>
  hasProperties(schemaRef, false, false, false, true);

const hasProperties = (schemaRef: SchemaRef, authority: boolean, folder: boolean, name: boolean, fragment?: boolean): boolean => {
  const test = schemaRef as AbsoluteFragmentSchemaRef;
  return (
    authority === (test.authority !== undefined) &&
    folder === (test.folder !== undefined) &&
    name === (test.name !== undefined) &&
    (fragment === undefined || fragment === (test.fragment !== undefined))
  );
};
