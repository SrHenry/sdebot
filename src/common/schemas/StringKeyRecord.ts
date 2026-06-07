import {
  any,
  record,
  string,
  type FluentSchema,
  type TypeGuard,
} from '@srhenry/type-utils';

import type { StringKeyRecord } from '@/common/types/StringKeyRecord';

export function StringKeyRecord(): FluentSchema<StringKeyRecord>;
export function StringKeyRecord<T>(
  valueSchema: TypeGuard<T>,
): FluentSchema<StringKeyRecord<T>>;

export function StringKeyRecord(valueSchema: TypeGuard<unknown> = any()) {
  return record(string(), valueSchema);
}
