type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type PartialDeep<T> = T extends Primitive
  ? Partial<T>
  : T extends Map<infer KeyType, infer ValueType>
  ? PartialMapDeep<KeyType, ValueType>
  : T extends Set<infer ItemType>
  ? PartialSetDeep<ItemType>
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? PartialReadonlyMapDeep<KeyType, ValueType>
  : T extends ReadonlySet<infer ItemType>
  ? PartialReadonlySetDeep<ItemType>
  : T extends object
  ? PartialObjectDeep<T>
  : unknown;

type PartialMapDeep<KeyType, ValueType> = Map<PartialDeep<KeyType>, PartialDeep<ValueType>>

type PartialSetDeep<T> = Set<PartialDeep<T>>

type PartialReadonlyMapDeep<KeyType, ValueType> = ReadonlyMap<PartialDeep<KeyType>, PartialDeep<ValueType>>

type PartialReadonlySetDeep<T> = ReadonlySet<PartialDeep<T>>

type PartialObjectDeep<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType]>
};
