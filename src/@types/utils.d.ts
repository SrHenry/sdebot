import type { Experimental, TypeGuard } from '@srhenry/type-utils';

declare global {
  declare type GetTypeFromSchema<
    T extends Experimental.Func<any[], TypeGuard>,
  > = T extends Experimental.Func<any[], TypeGuard<infer Type>> ? Type : never;

  declare type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}

export {};
