import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { References } from './References';

interface LocatedSchema {
  fileLocation: FileLocation;
  schema: Schema;
}

interface SchemaGatheredInfo {
  namedSchemas: Map<string, Schema>;
  references: References;
  oneOfTypes: Set<number>;
}

interface SchemaInputInfo {
  options: AllOptions;
  idFileLocations: Map<string, FileLocation>;
}

interface TypeGenerator {
  (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined;
}

export {
  LocatedSchema,
  SchemaInputInfo,
  SchemaGatheredInfo,
  TypeGenerator
};
