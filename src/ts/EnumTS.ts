import { TSType } from '.';
import { PrimitiveType } from './PrimitiveTS';
import { TS } from './TS';

interface EnumTS extends TS {
  tsType: TSType.ENUM;
  values: Map<string, string> | Map<string, number>;
  primitiveType?: PrimitiveType;
}

export {
  EnumTS
};
