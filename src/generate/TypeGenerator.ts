import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { References } from './References';

interface TypeGenerator {
  (schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined;
}

export {
  TypeGenerator
};
