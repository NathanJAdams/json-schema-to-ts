import { Schema } from '..';
import { SchemaConverter } from '.';
import {
  enumConverter,
  nullConverter,
  booleanConverter,
  integerConverter,
  numberConverter,
  stringConverter,
  collectionConverter,
  tupleConverter
} from './converters';
import { TS } from '../ts';
import { Options } from '../Options';

const CONVERTERS: SchemaConverter<TS>[] = [
  enumConverter,
  nullConverter,
  booleanConverter,
  integerConverter,
  numberConverter,
  stringConverter,
  collectionConverter,
  tupleConverter
];

const convert = (schema: Schema, options: Options, converters = CONVERTERS): TS | undefined => {
  for (const converter of converters) {
    const converted: TS | undefined = converter(schema, options);
    if (converted) {
      return converted;
    }
  }
  return undefined;
};

const convertMany = (fileSchemas: Map<string, Schema>, options: Options, converters = CONVERTERS): Map<string, TS> => {
  const convertedTypes: Map<string, TS> = new Map();
  fileSchemas.forEach((schema: Schema, file: string) => {
    const converted = convert(schema, options, converters);
    if (converted) {
      convertedTypes.set(file, converted);
    }
  });
  return convertedTypes;
};

export {
  convert,
  convertMany
};
