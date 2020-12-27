import { Options } from '../../Options';
import { PrimitiveTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';

const BLANK_REFERENCES: Set<string> = new Set();

const primitiveGenerator: TSGenerator<PrimitiveTS> = {
  root: (ts: PrimitiveTS, options: Options, location: SchemaLocation): string => {
    return primitiveGenerator.definition(ts, options, location.file, BLANK_REFERENCES);
  },
  definition: (ts: PrimitiveTS, options: Options, definitionId: string, references: Set<string>): string => {
    const inlined: string = primitiveGenerator.inline(ts, options, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: PrimitiveTS): string => {
    return ts.primitiveType;
  }
};

export {
  primitiveGenerator
};

