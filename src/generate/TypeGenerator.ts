import { Options } from '../options';
import { Schema } from '../schema';

interface TypeGenerator {
  (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined;
}

export {
  TypeGenerator
};
