export type PartialDeep<T> = T extends Primitive
  ? Partial<T>
  : T extends RegExp
  ? T
  : T extends object
  ? PartialObjectDeep<T>
  : unknown;

type Primitive = undefined | boolean | string;

type PartialObjectDeep<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType]>
};
