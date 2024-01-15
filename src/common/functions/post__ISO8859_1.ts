import type { KeyValuePair } from '@/common/types/KeyValuePair';
import { to__ISO_8859_1__UrlEncoded } from './to__ISO_8859_1__UrlEncoded';

export function post__ISO8859_1(
  url: string | URL,
  data: FormData | KeyValuePair[] | Iterable<KeyValuePair>,
) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; encoding=iso-8859-1',
    },
    body: to__ISO_8859_1__UrlEncoded(data),
  });
}
