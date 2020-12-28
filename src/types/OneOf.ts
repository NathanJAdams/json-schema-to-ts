type Suppress_1<T, S0> = T & { [P in Exclude<(keyof S0), keyof T>]?: never };
type Suppress_2<T, S0, S1> = T & { [P in Exclude<(keyof S0 | keyof S1), keyof T>]?: never };
type Suppress_3<T, S0, S1, S2> = T & { [P in Exclude<(keyof S0 | keyof S1 | keyof S2), keyof T>]?: never };
type Suppress_4<T, S0, S1, S2, S3> = T & { [P in Exclude<(keyof S0 | keyof S1 | keyof S2 | keyof S3), keyof T>]?: never };
type Suppress_5<T, S0, S1, S2, S3, S4> = T & { [P in Exclude<(keyof S0 | keyof S1 | keyof S2 | keyof S3 | keyof S4), keyof T>]?: never };
type Suppress_6<T, S0, S1, S2, S3, S4, S5> = T & { [P in Exclude<(keyof S0 | keyof S1 | keyof S2 | keyof S3 | keyof S4 | keyof S5), keyof T>]?: never };
type Suppress_7<T, S0, S1, S2, S3, S4, S5, S6> = T & { [P in Exclude<(keyof S0 | keyof S1 | keyof S2 | keyof S3 | keyof S4 | keyof S5 | keyof S6), keyof T>]?: never };

export type OneOf_2<T0, T1> = (T0 | T1) extends object
  ? Suppress_1<T0, T1>
  | Suppress_1<T1, T0>
  : T0 | T1;

export type OneOf_3<T0, T1, T2> = (T0 | T1 | T2) extends object
  ? Suppress_2<T0, T1, T2>
  | Suppress_2<T1, T0, T2>
  | Suppress_2<T2, T0, T1>
  : T0 | T1 | T2;

export type OneOf_4<T0, T1, T2, T3> = (T0 | T1 | T2 | T3) extends object
  ? Suppress_3<T0, T1, T2, T3>
  | Suppress_3<T1, T0, T2, T3>
  | Suppress_3<T2, T0, T1, T3>
  | Suppress_3<T3, T0, T1, T2>
  : T0 | T1 | T2 | T3;

export type OneOf_5<T0, T1, T2, T3, T4> = (T0 | T1 | T2 | T3 | T4) extends object
  ? Suppress_4<T0, T1, T2, T3, T4>
  | Suppress_4<T1, T0, T2, T3, T4>
  | Suppress_4<T2, T0, T1, T3, T4>
  | Suppress_4<T3, T0, T1, T2, T4>
  | Suppress_4<T4, T0, T1, T2, T3>
  : T0 | T1 | T2 | T3 | T4;

export type OneOf_6<T0, T1, T2, T3, T4, T5> = (T0 | T1 | T2 | T3 | T4 | T5) extends object
  ? Suppress_5<T0, T1, T2, T3, T4, T5>
  | Suppress_5<T1, T0, T2, T3, T4, T5>
  | Suppress_5<T2, T0, T1, T3, T4, T5>
  | Suppress_5<T3, T0, T1, T2, T4, T5>
  | Suppress_5<T4, T0, T1, T2, T3, T5>
  | Suppress_5<T5, T0, T1, T2, T3, T4>
  : T0 | T1 | T2 | T3 | T4 | T5;

export type OneOf_7<T0, T1, T2, T3, T4, T5, T6> = (T0 | T1 | T2 | T3 | T4 | T5 | T6) extends object
  ? Suppress_6<T0, T1, T2, T3, T4, T5, T6>
  | Suppress_6<T1, T0, T2, T3, T4, T5, T6>
  | Suppress_6<T2, T0, T1, T3, T4, T5, T6>
  | Suppress_6<T3, T0, T1, T2, T4, T5, T6>
  | Suppress_6<T4, T0, T1, T2, T3, T5, T6>
  | Suppress_6<T5, T0, T1, T2, T3, T4, T6>
  | Suppress_6<T6, T0, T1, T2, T3, T4, T5>
  : T0 | T1 | T2 | T3 | T4 | T5 | T6;

export type OneOf_8<T0, T1, T2, T3, T4, T5, T6, T7> = (T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7) extends object
  ? Suppress_7<T0, T1, T2, T3, T4, T5, T6, T7>
  | Suppress_7<T1, T0, T2, T3, T4, T5, T6, T7>
  | Suppress_7<T2, T0, T1, T3, T4, T5, T6, T7>
  | Suppress_7<T3, T0, T1, T2, T4, T5, T6, T7>
  | Suppress_7<T4, T0, T1, T2, T3, T5, T6, T7>
  | Suppress_7<T5, T0, T1, T2, T3, T4, T6, T7>
  | Suppress_7<T6, T0, T1, T2, T3, T4, T5, T7>
  | Suppress_7<T7, T0, T1, T2, T3, T4, T5, T6>
  : T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7;
