import { Schema } from '../..';
import { PrimitiveType, PrimitiveTS, TS, TSType } from '../../ts';
import { SchemaConverter } from '..';

const NULL_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.NULL };
const BOOLEAN_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.BOOLEAN };
const NUMBER_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.NUMBER };
const STRING_TS: PrimitiveTS = { tsType: TSType.PRIMITIVE, primitiveType: PrimitiveType.STRING };

const createConverter = <T extends TS>(type: string, converted: T): SchemaConverter<T> => (schema: Schema): T | undefined => (schema.type === type) ? converted : undefined;

const nullConverter: SchemaConverter<PrimitiveTS> = createConverter('null', NULL_TS);
const booleanConverter: SchemaConverter<PrimitiveTS> = createConverter('boolean', BOOLEAN_TS);
const integerConverter: SchemaConverter<PrimitiveTS> = createConverter('integer', NUMBER_TS);
const numberConverter: SchemaConverter<PrimitiveTS> = createConverter('number', NUMBER_TS);
const stringConverter: SchemaConverter<PrimitiveTS> = createConverter('string', STRING_TS);

export {
  nullConverter,
  booleanConverter,
  integerConverter,
  numberConverter,
  stringConverter
};
