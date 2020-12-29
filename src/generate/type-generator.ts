import { Options } from '../options';
import { Schema } from '../schema';
import { filtered } from '../util';
import { allOfGenerator } from './all-of-generator';
import { anyOfGenerator } from './any-of-generator';
import { collectionGenerator } from './collection-generator';
import { enumGenerator } from './enum-generator';
import { objectGenerator } from './object-generator';
import { oneOfGenerator } from './one-of-generator';
import { primitiveGenerator } from './primitive-generator';
import { referenceGenerator } from './reference-generator';
import { tupleGenerator } from './tuple-generator';

const typeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string => {
  const types: (string | undefined)[] = [];
  types.push(primitiveGenerator(schema, namedSchemas, references, options));
  types.push(referenceGenerator(schema, namedSchemas, references, options));
  types.push(enumGenerator(schema, namedSchemas, references, options));
  types.push(collectionGenerator(schema, namedSchemas, references, options));
  types.push(tupleGenerator(schema, namedSchemas, references, options));
  types.push(objectGenerator(schema, namedSchemas, references, options));
  types.push(allOfGenerator(schema, namedSchemas, references, options));
  types.push(anyOfGenerator(schema, namedSchemas, references, options));
  types.push(oneOfGenerator(schema, namedSchemas, references, options));
  const filteredLines: string[] = filtered(types);
  if (filteredLines.length === 0) {
    return options.ts.untyped;
  }
  return filteredLines.join('\n& ');
};

export {
  typeGenerator
};
