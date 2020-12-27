import { TS, TSType } from '.';

interface ReferenceTS extends TS {
  tsType: TSType.REFERENCE;
  fullyQualifiedReference: string;
}

export {
  ReferenceTS
};
