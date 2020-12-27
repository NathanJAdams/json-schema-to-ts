import { Schema } from '..';
import { SchemaConverter } from '.';
import {
  nullConverter,
  booleanConverter,
  integerConverter,
  numberConverter,
  stringConverter,
  collectionConverter
} from './converters';
import { TS } from '../ts';

const CONVERTERS: SchemaConverter<TS>[] = [
  nullConverter,
  booleanConverter,
  integerConverter,
  numberConverter,
  stringConverter,
  collectionConverter
];

const convert = (schema: Schema, converters = CONVERTERS): TS | undefined => {
  for (const converter of converters) {
    const converted: TS | undefined = converter(schema);
    if (converted !== undefined) {
      return converted;
    }
  }
  return undefined;
};

const convertMany = (fileSchemas: Map<string, Schema>, converters = CONVERTERS): Map<string, TS> => {
  const convertedTypes: Map<string, TS> = new Map();
  fileSchemas.forEach((schema: Schema, file: string) => {
    const converted = convert(schema, converters);
    if (converted !== undefined) {
      convertedTypes.set(file, converted);
    }
  });
  return convertedTypes;
};

export {
  convert,
  convertMany
};
