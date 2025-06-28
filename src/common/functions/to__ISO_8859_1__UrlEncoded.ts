import { KeyValuePair } from '../types/KeyValuePair';
import { isStringKeyValuePair } from './filters/isStringKeyValuePair';
import { uriEncodeWithEscape } from './mappers/KeyValueTuples/uriEncodeWithEscape';

/**
 * @deprecated it uses deprecated escape() function
 */
export function to__ISO_8859_1__UrlEncoded(
  data: FormData | KeyValuePair[] | Iterable<KeyValuePair>,
): string {
  return [...data]
    .filter(isStringKeyValuePair)
    .map(uriEncodeWithEscape)
    .join('&');
}
