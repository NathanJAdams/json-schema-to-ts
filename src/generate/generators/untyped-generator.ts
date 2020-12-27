import { UntypedTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';

const BLANK_REFERENCES: Set<string> = new Set();

// TODO check definitions and combinations

const untypedGenerator: TSGenerator<UntypedTS> = {
  root: (ts: UntypedTS, location: SchemaLocation): string => {
    return untypedGenerator.definition(ts, location.file, BLANK_REFERENCES);
  },
  definition: (ts: UntypedTS, definitionId: string, references: Set<string>): string => {
    const inlined: string = untypedGenerator.inline(ts, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: UntypedTS): string => {
    return ts.untypedType;
  }
};

export {
  untypedGenerator
};

