import { KeyValuePair } from '@/common/types/KeyValuePair';

/**
 * @deprecated it uses deprecated escape() function
 */
export const uriEncodeWithEscape = ([k, v]: KeyValuePair) =>
  [k, escape(v)].join('=');
