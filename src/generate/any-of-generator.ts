import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Options } from '../Options';
import { filtered } from '../util';

const anyOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.anyOf || schema.anyOf.length === 0) {
    return undefined;
  }
  console.log('AnyOf');
  const lines: (string | undefined)[] = [];
  schema.anyOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options);
    lines.push(elementContent);
  });
  console.log('AnyOf lines: ' + lines);
  const filteredLines: string[] = filtered(lines);
  console.log('AnyOf filteredLines: ' + filteredLines);
  if (filteredLines.length === 0) {
    return undefined;
  } else if (filteredLines.length === 1) {
    return filteredLines[0];
  } else {
    const joined:string= '(' + filteredLines.join('\n| ') + ')';
    console.log('AnyOf joined: ' + joined);
    return joined;
  }
};

export {
  anyOfGenerator
};
