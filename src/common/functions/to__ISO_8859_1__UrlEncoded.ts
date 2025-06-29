import { isStringKeyValuePair } from '@/common/functions/filters/isStringKeyValuePair';
import { uriEncodeWithEscape } from '@/common/functions/mappers/KeyValueTuples/uriEncodeWithEscape';
import { KeyValuePair } from '@/common/types/KeyValuePair';

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
