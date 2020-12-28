import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Options } from '../Options';

const tupleGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.type || schema.type !== 'array' || !schema.items || !Array.isArray(schema.items)) {
    return undefined;
  }
  const elementTypesContent: string[] = [];
  schema.items.forEach((elementSchema: Schema) => {
    const content: string = typeGenerator(elementSchema, namedSchemas, references, options);
    elementTypesContent.push(content);
  });
  const joined: string = elementTypesContent.join(', ');
  return `[${joined}]`;
};

export {
  tupleGenerator
};
