import { array, TypeGuard } from '@srhenry/type-utils';

import type { KeyValueArray } from '@/common/types/KeyValueArray';

import { KeyValuePair } from '@/common/schemas/KeyValuePair';

export function KeyValueArray(): TypeGuard<KeyValueArray<unknown, unknown>>;
export function KeyValueArray<K, V>(
  keyGuard: TypeGuard<K>,
  valueGuard: TypeGuard<V>,
): TypeGuard<KeyValueArray<K, V>>;

export function KeyValueArray<K = unknown, V = unknown>(
  keyGuard?: TypeGuard<K>,
  valueGuard?: TypeGuard<V>,
): TypeGuard<KeyValueArray<K, V>> | TypeGuard<KeyValueArray<unknown, unknown>> {
  if (!!keyGuard && !!valueGuard)
    return array(KeyValuePair(keyGuard, valueGuard)) as TypeGuard<
      KeyValueArray<K, V>
    >;

  return array(KeyValuePair()) as TypeGuard<KeyValueArray<unknown, unknown>>;
}
