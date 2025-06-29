import { KeyValuePair } from '@/common/types/KeyValuePair';
import { ArrayRules, array, string, type TypeGuard } from '@srhenry/type-utils';

const { min, max } = ArrayRules;

export const isStringKeyValuePair = array(
  [min(2), max(2)],
  string(),
) as TypeGuard<KeyValuePair<string, string>>;
