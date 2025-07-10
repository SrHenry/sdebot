import {
  array,
  ArrayRules,
  createRule,
  type Custom,
  type TypeGuard,
} from '@srhenry/type-utils';

import type { KeyValuePair } from '@/common/types/KeyValuePair';

const { min, max } = ArrayRules;

type KeyValuePairRuleFactory = {
  (): Custom<[], typeof name, KeyValuePair<unknown, unknown>>;
  <K, V>(keyGuard: TypeGuard<K>, valueGuard: TypeGuard<V>): Custom<
    [typeof keyGuard, typeof valueGuard],
    typeof name,
    KeyValuePair<K, V>
  >;
};

const name = 'sdebot.key_value_pair' as const;
const handler =
  <K, V>([key, value]: KeyValuePair<K, V>) =>
  (keyGuard?: TypeGuard<K>, valueGuard?: TypeGuard<V>) =>
    !!keyGuard && !!valueGuard && keyGuard(key) && valueGuard(value);

const keyValuePairRule = createRule({
  name,
  handler,
}) as KeyValuePairRuleFactory;

export function KeyValuePair(): TypeGuard<KeyValuePair<unknown, unknown>>;
export function KeyValuePair<K, V>(
  keyGuard: TypeGuard<K>,
  valueGuard: TypeGuard<V>,
): TypeGuard<KeyValuePair<K, V>>;

export function KeyValuePair<K = unknown, V = unknown>(
  keyGuard?: TypeGuard<K>,
  valueGuard?: TypeGuard<V>,
): TypeGuard<KeyValuePair<K, V>> | TypeGuard<KeyValuePair<unknown, unknown>> {
  if (!!keyGuard && !!valueGuard)
    return array([
      min(2),
      max(2),
      keyValuePairRule(keyGuard, valueGuard),
    ]) as TypeGuard<KeyValuePair<K, V>>;

  return array([min(2), max(2), keyValuePairRule()]) as TypeGuard<
    KeyValuePair<unknown, unknown>
  >;
}
