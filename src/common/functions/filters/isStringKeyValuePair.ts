import { string, tuple } from '@srhenry/type-utils';

export const isStringKeyValuePair = tuple([string(), string()]);
