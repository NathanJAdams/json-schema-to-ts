import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Options } from '../Options';
import { filtered } from '../util';

const oneOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.oneOf || schema.oneOf.length === 0) {
    return undefined;
  }
  console.log('OneOf');
  const lines: (string | undefined)[] = [];
  schema.oneOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options);
    lines.push(elementContent);
  });
  console.log('OneOf lines: ' + lines);
  const filteredLines: string[] = filtered(lines);
  console.log('OneOf filteredLines: ' + filteredLines);
  if (filteredLines.length === 0) {
    return undefined;
  } else if (filteredLines.length === 1) {
    return filteredLines[0];
  } else {
    references.add('OneOf');
    const joined = `OneOf<${filteredLines.join(', ')}>`;
    console.log('OneOf joined: ' + joined);
    return joined;
  }
};

export {
  oneOfGenerator
};
