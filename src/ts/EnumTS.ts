import { TSType } from '.';
import { SchemaEnum } from '../Schema';
import { ComplexTS } from './ComplexTS';

interface EnumTS extends ComplexTS {
  tsType: TSType.ENUM;
  values: SchemaEnum;
}

export {
  EnumTS
};
