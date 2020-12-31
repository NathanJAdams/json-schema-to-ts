import { FileLocation } from '../files';
import { Schema } from '../schema';
import { AllOptions } from '../options';
import { filtered } from '../util';
import { References } from './References';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const anyOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (!schema.anyOf || schema.anyOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.anyOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options, idFileLocations);
    lines.push(elementContent);
  });
  const filteredLines: string[] = filtered(lines);
  if (filteredLines.length === 0) {
    return undefined;
  } else if (filteredLines.length === 1) {
    return filteredLines[0];
  } else {
    return '(' + filteredLines.join('\n| ') + ')';
  }
};

export {
  anyOfGenerator
};
