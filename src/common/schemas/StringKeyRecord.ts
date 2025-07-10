import { any, record, string, type TypeGuard } from '@srhenry/type-utils';

import type { StringKeyRecord } from '@/common/types/StringKeyRecord';

export function StringKeyRecord(): TypeGuard<StringKeyRecord>;
export function StringKeyRecord<T>(
  valueSchema: TypeGuard<T>,
): TypeGuard<StringKeyRecord<T>>;

export function StringKeyRecord(valueSchema = any()) {
  return record(string(), valueSchema);
}
