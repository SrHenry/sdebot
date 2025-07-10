import { Collection } from '@/common/types/Collection';
import { KeyValueArray } from '@/common/types/KeyValueArray';
import { KeyValuePair } from '@/common/types/KeyValuePair';

export type DataSet<T extends Collection> = KeyValuePair<
  keyof T,
  KeyValueArray<string, Value<T[keyof T]>>
>;
export type DataSets<T extends Collection> = DataSet<T>[];
