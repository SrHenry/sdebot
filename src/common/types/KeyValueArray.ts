import { KeyValuePair } from '@/common/types/KeyValuePair';

export type KeyValueArray<TKey = string, TValue = string> = KeyValuePair<
  TKey,
  TValue
>[];
