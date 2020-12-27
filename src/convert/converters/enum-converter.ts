import { Schema } from '../..';
import { SchemaConverter } from '..';
import { EnumTS, TSType } from '../../ts';

const enumConverter: SchemaConverter<EnumTS> = (schema: Schema): EnumTS | undefined => {
  if (!schema.enum) {
    return undefined;
  }
  return {
    tsType: TSType.ENUM,
    id: schema.$id,
    values: schema.enum
  };
};

export {
  enumConverter
};
