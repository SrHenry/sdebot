import { any, tuple, type TypeGuard } from '@srhenry/type-utils';

import type { KeyValuePair } from '@/common/types/KeyValuePair';

export function KeyValuePair(): TypeGuard<KeyValuePair<unknown, unknown>>;
export function KeyValuePair<K, V>(
  keyGuard: TypeGuard<K>,
  valueGuard: TypeGuard<V>,
): TypeGuard<KeyValuePair<K, V>>;

export function KeyValuePair<K = unknown, V = unknown>(
  keyGuard?: TypeGuard<K>,
  valueGuard?: TypeGuard<V>,
): TypeGuard<KeyValuePair<K, V>> | TypeGuard<KeyValuePair<unknown, unknown>> {
  if (!!keyGuard !== !!valueGuard)
    throw new TypeError('Invalid arguments! Expected 2, 1 was given.');

  return tuple([keyGuard ?? any(), valueGuard ?? any()]);
}
