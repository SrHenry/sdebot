import { KeyValuePair } from '@/common/schemas/KeyValuePair';
import { string } from '@srhenry/type-utils';

export const isStringKeyValuePair = KeyValuePair(string(), string());
