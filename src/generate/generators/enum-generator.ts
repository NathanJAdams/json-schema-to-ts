import { EnumTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';
import { combine } from './generate';

const BLANK_REFERENCES: Set<string> = new Set();

const enumGenerator: TSGenerator<EnumTS> = {
  root: (ts: EnumTS, location: SchemaLocation): string => {
    return enumGenerator.definition(ts, location.file, BLANK_REFERENCES);
  },
  definition: (ts: EnumTS, definitionId: string, references: Set<string>): string => {
    const inlined: string = enumGenerator.inline(ts, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: EnumTS): string => {
    const values: string[] = [];
    ts.values.forEach((value: null | boolean | number | string) => {
      const valueString = (typeof value === 'string')
        ? `'${String(value)}'`
        : String(value);
      values.push(valueString);
    });
    return combine('\n| ', ...values);
  }
};

export {
  enumGenerator
};
