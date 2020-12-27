import { Schema } from '../..';
import { TS } from '../../ts';
import { convert } from '..';

const convertArray = (array: Schema[]): TS[] => {
  const converted: TS[] = [];
  array.forEach((schema: Schema) => {
    const ts: TS | undefined = convert(schema);
    if (ts) {
      converted.push(ts);
    }
  });
  return converted;
};

const convertDefinitions = (definitions: Map<string, Schema> | undefined): Map<string, TS> | undefined => {
  if (definitions === undefined) {
    return undefined;
  }
  const converted: Map<string, TS> = new Map();
  definitions.forEach((schema: Schema, definitionId: string) => {
    const definitionTS: TS | undefined = convert(schema);
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
