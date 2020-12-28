import * as path from 'path';
import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';

const referenceGenerator: TypeGenerator = (schema: Schema, _namedSchemas: Map<string, Schema>, references: Set<string>): string | undefined => {
  if (!schema.$ref) {
    return undefined;
  }
  const name: string = path.basename(schema.$ref);
  references.add(schema.$ref);
  return name;
};

export {
  referenceGenerator
};
