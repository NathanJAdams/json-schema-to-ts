import { TS, TSType } from '.';
import { ComplexTS } from './ComplexTS';

enum CollectionType {
  ARRAY = 'ARRAY',
  SET = 'SET'
}

interface CollectionTS extends ComplexTS {
  tsType: TSType.COLLECTION;
  elementType: TS;
  collectionType: CollectionType;
}

export {
  CollectionType,
  CollectionTS
};
