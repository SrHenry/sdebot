import { any, tuple, type TypeGuard } from '@srhenry/type-utils';

export const isKeyValuePair: TypeGuard<[unknown, unknown]> = tuple([
  any(),
  any(),
]);
