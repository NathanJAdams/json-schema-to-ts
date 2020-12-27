import { Schema } from '../..';
import { SchemaConverter } from '..';
import { Options } from '../../Options';
import { TSType, UntypedTS } from '../../ts';
import { convertArray, convertDefinitions } from './convert';

const untypedConverter: SchemaConverter<UntypedTS> = (schema: Schema, options: Options): UntypedTS | undefined => {
  return {
    tsType: TSType.UNTYPED,
    id: schema.$id,
    definitions: convertDefinitions(schema.definitions, options),
    intersectionTypesAllOf: convertArray(schema.allOf, options),
    unionTypesAnyOf: convertArray(schema.anyOf, options),
    unionTypesOneOf: convertArray(schema.oneOf, options),
    untypedType: options.ts.untyped
  };
};

export {
  untypedConverter
};
