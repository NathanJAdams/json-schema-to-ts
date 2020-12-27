import { Schema } from '../..';
import { SchemaConverter } from '..';
import { Options } from '../../Options';
import { TSType, UntypedTS } from '../../ts';

const untypedConverter: SchemaConverter<UntypedTS> = (schema: Schema, options: Options): UntypedTS | undefined => {
  return {
    tsType: TSType.UNTYPED,
    id: schema.$id,
    untypedType: options.ts.untyped
  };
};

export {
  untypedConverter
};
