import { Schema } from '../..';
import { TS, TSType, TupleTS } from '../../ts';
import { SchemaConverter } from '..';
import { convertArray, convertDefinitions } from './convert';
import { Options } from '../../Options';

const tupleConverter: SchemaConverter<TupleTS> = (schema: Schema, options: Options): TupleTS | undefined => {
  const type: string | undefined = schema.type;
  if (type && type !== 'array') {
    return undefined;
  }
  const items: Schema | Schema[] | undefined = schema.items;
  if (!items || !Array.isArray(items)) {
    return undefined;
  }
  const elementTypes: TS[] | undefined = convertArray(items, options);
  if (!elementTypes) {
    return undefined;
  }
  const definitions: Map<string, TS> | undefined = convertDefinitions(schema.definitions, options);
  return {
    tsType: TSType.TUPLE,
    id: schema.$id,
    elementTypes,
    definitions
  };
};

export {
  tupleConverter
};
