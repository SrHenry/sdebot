import type { KeyValuePair } from './KeyValuePair';

export type KeyValueArray<TKey = string, TValue = string> = KeyValuePair<
  TKey,
  TValue
>[];
