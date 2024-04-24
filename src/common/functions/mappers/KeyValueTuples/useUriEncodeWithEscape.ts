import { KeyValuePair } from '../../../types/KeyValuePair';

/**
 * @deprecated it uses deprecated escape() function
 */
export function useUriEncodeWithEscape([k, v]: KeyValuePair) {
  return [k, escape(v)].join('=');
}
