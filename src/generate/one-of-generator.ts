import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Options } from '../options';
import { filtered } from '../util';

const oneOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.oneOf || schema.oneOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.oneOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options);
    lines.push(elementContent);
  });
  const filteredLines: string[] = filtered(lines);
  if (filteredLines.length === 0) {
    return undefined;
  } else if (filteredLines.length === 1) {
    return filteredLines[0];
  } else if (filteredLines.length > 8) {
    throw Error('Cannot currently create OneOf type for more than 8 types');
  } else {
    const typeName = `OneOf_${filteredLines.length}`;
    references.add(`json-schema-to-ts/${typeName}`);
    return `${typeName}<${filteredLines.join(', ')}>`;
  }
};

export {
  oneOfGenerator
};
