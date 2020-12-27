import { Schema } from '../..';
import { PrimitiveType, PrimitiveTS, TSType } from '../../ts';
import { SchemaConverter } from '..';

const NULL_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.NULL };
const BOOLEAN_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.BOOLEAN };
const NUMBER_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.NUMBER };
const STRING_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.STRING };

const createConverter = <T extends PrimitiveTS>(ts: T): SchemaConverter<T> => (schema: Schema): T | undefined => (schema.type === ts.primitiveType) ? ts : undefined;

const nullConverter: SchemaConverter<PrimitiveTS> = createConverter(NULL_TS);
const booleanConverter: SchemaConverter<PrimitiveTS> = createConverter(BOOLEAN_TS);
const integerConverter: SchemaConverter<PrimitiveTS> = createConverter(NUMBER_TS);
const numberConverter: SchemaConverter<PrimitiveTS> = createConverter(NUMBER_TS);
const stringConverter: SchemaConverter<PrimitiveTS> = createConverter(STRING_TS);

export {
  nullConverter,
  booleanConverter,
  integerConverter,
  numberConverter,
  stringConverter
};
