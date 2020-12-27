import { PrimitiveTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';

const BLANK_REFERENCES: Set<string> = new Set();

const primitiveGenerator: TSGenerator<PrimitiveTS> = {
  root: (ts: PrimitiveTS, location: SchemaLocation): string => {
    return primitiveGenerator.definition(ts, location.file, BLANK_REFERENCES);
  },
  definition: (ts: PrimitiveTS, definitionId: string, references: Set<string>): string => {
    const inlined: string = primitiveGenerator.inline(ts, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: PrimitiveTS): string => {
    return ts.primitiveType;
  }
};

export {
  primitiveGenerator
};

