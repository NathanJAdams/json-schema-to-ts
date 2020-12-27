import { Schema } from '../..';
import { TS } from '../../ts';
import { convert } from '..';
import { Options } from '../../Options';

const convertArray = (array: Schema[], options: Options): TS[] => {
  const converted: TS[] = [];
  array.forEach((schema: Schema) => {
    const ts: TS | undefined = convert(schema, options);
    if (ts) {
      converted.push(ts);
    }
  });
  return converted;
};

const convertDefinitions = (definitions: Map<string, Schema> | undefined, options: Options): Map<string, TS> | undefined => {
  if (definitions === undefined) {
    return undefined;
  }
  const converted: Map<string, TS> = new Map();
  definitions.forEach((schema: Schema, definitionId: string) => {
    const definitionTS: TS | undefined = convert(schema, options);
    if (definitionTS) {
      converted.set(definitionId, definitionTS);
    }
  });
  return converted;
};

export {
  convertArray,
  convertDefinitions
};
