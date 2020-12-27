import { Options } from '../../Options';
import { EnumTS, PrimitiveTS, TSType } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';
import { combineElements } from './generate';
import { primitiveGenerator } from './primitive-generator';

const BLANK_REFERENCES: Set<string> = new Set();

const enumGenerator: TSGenerator<EnumTS> = {
  root: (ts: EnumTS, options: Options, location: SchemaLocation): string => {
    return enumGenerator.definition(ts, options, location.file, BLANK_REFERENCES);
  },
  definition: (ts: EnumTS, _options: Options, definitionId: string): string => {
    const lines: string[] = [];
    lines.push(`export enum ${definitionId} {`);
    ts.values.forEach((value: string | number, key: string) => {
      const line: string = (typeof value === 'string')
        ? `${key} = '${value}',`
        : `${key} = ${value},`;
      lines.push(line);
    });
    lines.push('};');
    return combineElements(...lines);
  },
  inline: (ts: EnumTS, options: Options, references: Set<string>): string => {
    if (ts.primitiveType) {
      const primitiveTS: PrimitiveTS = {
        tsType: TSType.PRIMITIVE,
        id: ts.id,
        primitiveType: ts.primitiveType
      };
      return primitiveGenerator.inline(primitiveTS, options, references);
    }
    throw Error('Cannot generate an inline enum without a primitive type');
  }
};

export {
  enumGenerator
};
