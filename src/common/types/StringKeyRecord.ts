import { any, record, string, type TypeGuard } from '@srhenry/type-utils';

export function StringKeyRecord(): TypeGuard<Record<string, any>>;
export function StringKeyRecord<T>(
  valueSchema: TypeGuard<T>,
): TypeGuard<Record<string, T>>;

export function StringKeyRecord(valueSchema = any()) {
  return record(string(), valueSchema);
}
