type Properties<_> = {
}

type NullProperties<T> = Properties<T> & {
}

type NumberProperties<T extends number> = Properties<T> & {
    multipleOf?: number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
}

type StringProperties<T extends string> = Properties<T> & {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
}

type ArrayProperties<T> = Properties<T> & {
    minItems?: number;
    maxItems?: number;
    contains?: T;
    minContains?: number;
    maxContains?: number;
}

type FieldProperties<T>
    = T extends number
    ? NumberProperties<T>
    : T extends string
    ? StringProperties<T>
    : T extends Array<infer A>
    ? ArrayProperties<A>
    : T extends Set<infer A>
    ? ArrayProperties<A>
    : T extends [infer A]
    ? ArrayProperties<[A]>
    : T extends [infer A, infer B]
    ? ArrayProperties<[A, B]>
    : T extends [infer A, infer B, infer C]
    ? ArrayProperties<[A, B, C]>
    : T extends [infer A, infer B, infer C, infer D]
    ? ArrayProperties<[A, B, C, D]>
    : T extends [infer A, infer B, infer C, infer D, infer E]
    ? ArrayProperties<[A, B, C, D, E]>
    : T extends [infer A, infer B, infer C, infer D, infer E, infer F]
    ? ArrayProperties<[A, B, C, D, E, F]>
    : T extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G]
    ? ArrayProperties<[A, B, C, D, E, F, G]>
    : T extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H]
    ? ArrayProperties<[A, B, C, D, E, F, G, H]>
    : NullProperties<T>;

type ObjectProperties<T> = {
    [K in keyof T]: FieldProperties<T[K]>;
};

export {
    Properties,
    NullProperties,
    NumberProperties,
    StringProperties,
    ArrayProperties,
    ObjectProperties
}
