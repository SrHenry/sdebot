import type { KeyValuePair } from '@/common/types/KeyValuePair';
import { ArrayRules, array, type TypeGuard } from '@srhenry/type-utils';

const { min, max } = ArrayRules;

export const isKeyValuePair = array([min(2), max(2)]) as TypeGuard<
  KeyValuePair<unknown, unknown>
>;
