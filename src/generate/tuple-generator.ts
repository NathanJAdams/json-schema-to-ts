import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { References } from './References';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const tupleGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (!schema.type || schema.type !== 'array' || !schema.items || !Array.isArray(schema.items)) {
    return undefined;
  }
  const elementTypesContent: string[] = [];
  schema.items.forEach((elementSchema: Schema) => {
    const content: string = typeGenerator(elementSchema, namedSchemas, references, options, idFileLocations);
    elementTypesContent.push(content);
  });
  const joined: string = elementTypesContent.join(', ');
  return `[${joined}]`;
};

export {
  tupleGenerator
};
