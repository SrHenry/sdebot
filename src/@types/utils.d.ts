import type { TypeGuard, Fn } from '@srhenry/type-utils';

declare global {
  declare type GetTypeFromSchema<T extends Fn<any[], TypeGuard>> =
    T extends Fn<any[], TypeGuard<infer Type>> ? Type : never;

  declare type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}

export {};
