import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Options } from '../Options';
import { filtered } from '../util';

const allOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.allOf || schema.allOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.allOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options);
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
