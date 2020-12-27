import { Schema } from '../..';
import { TS, TSType, TupleTS } from '../../ts';
import { SchemaConverter } from '..';
import { convertArray, convertDefinitions } from './convert';

const tupleConverter: SchemaConverter<TupleTS> = (schema: Schema): TupleTS | undefined => {
  const type: string | undefined = schema.type;
  if (type && type !== 'array') {
    return undefined;
  }
  const items: Schema | Schema[] | undefined = schema.items;
  if (!items || !Array.isArray(items)) {
    return undefined;
  }
  const elementTypes: TS[] = convertArray(items);
  const definitions: Map<string, TS> | undefined = convertDefinitions(schema.definitions);
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
