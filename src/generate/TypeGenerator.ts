import { FileLocation } from '../files';
import { SchemaId } from '../ids';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { References } from './References';

export type LocatedSchema = {
  fileLocation: FileLocation;
  schema: Schema;
}

export type SchemaGatheredInfo = {
  namedSchemas: Map<string, Schema>;
  references: References;
  oneOfTypes: Set<number>;
}

export type SchemaInputInfo = {
  options: AllOptions;
  idFileLocations: Map<SchemaId, FileLocation>;
}

export type TypeGenerator = {
  (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined;
}

export const located = (schema: Schema, located: LocatedSchema): LocatedSchema => ({
  fileLocation: located.fileLocation,
  schema
});
