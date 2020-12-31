import { FileLocation } from '../files';
import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { AllOptions } from '../options';
import { filtered } from '../util';
import { References } from './References';

const allOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (!schema.allOf || schema.allOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.allOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options, idFileLocations);
    lines.push(elementContent);
  });
  const filteredLines: string[] = filtered(lines);
  if (filteredLines.length === 0) {
    return undefined;
  }
  return filteredLines.join('\n& ');
};

export {
  allOfGenerator
};
