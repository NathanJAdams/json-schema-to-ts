import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Options } from '../Options';
import { filtered } from '../util';

const allOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.allOf || schema.allOf.length === 0) {
    return undefined;
  }
  console.log('AllOf');
  const lines: (string | undefined)[] = [];
  schema.allOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options);
    console.log('AllOf element content: ' + elementContent);
    lines.push(elementContent);
  });
  console.log('AllOf lines:' + lines);
  const filteredLines: string[] = filtered(lines);
  console.log('AllOf filteredLines:' + filteredLines);
  if (filteredLines.length === 0) {
    return undefined;
  }
  const joined:string= filteredLines.join('\n& ');
  console.log('AllOf joined: ' + joined);
  return joined;
};

export {
  allOfGenerator
};
