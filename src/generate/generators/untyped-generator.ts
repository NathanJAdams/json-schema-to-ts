import { Options } from '../../Options';
import { UntypedTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';

const BLANK_REFERENCES: Set<string> = new Set();

const untypedGenerator: TSGenerator<UntypedTS> = {
  root: (ts: UntypedTS, options: Options, location: SchemaLocation): string => {
    return untypedGenerator.definition(ts, options, location.file, BLANK_REFERENCES);
  },
  definition: (ts: UntypedTS, options: Options, definitionId: string, references: Set<string>): string => {
    const inlined: string = untypedGenerator.inline(ts, options, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: UntypedTS): string => {
    return ts.untypedType;
  }
};

export {
  untypedGenerator
};

