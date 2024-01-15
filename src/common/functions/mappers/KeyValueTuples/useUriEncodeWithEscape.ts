import { KeyValuePair } from '../../../types/KeyValuePair';

export function useUriEncodeWithEscape([k, v]: KeyValuePair) {
  return [k, escape(v)].join('=');
}
