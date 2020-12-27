import { TSType } from '.';
import { SchemaEnum } from '../Schema';
import { TS } from './TS';

interface EnumTS extends TS {
  tsType: TSType.ENUM;
  values: SchemaEnum;
}

export {
  EnumTS
};
