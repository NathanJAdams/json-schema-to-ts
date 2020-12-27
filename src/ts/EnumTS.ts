import { TSType } from '.';
import { TS } from './TS';

interface EnumTS extends TS {
  tsType: TSType.ENUM;
  values: Map<string, string> | Map<string, number>;
}

export {
  EnumTS
};
