import { Options as RequiredOptions } from './options';
import { PartialDeep } from './types';

export type Options = PartialDeep<RequiredOptions>;

export * from './main';
export { OptionalFieldPattern } from './options';
export * from './types/OneOf';
