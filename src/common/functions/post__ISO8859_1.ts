import { to__ISO_8859_1__UrlEncoded } from '@/common/functions/to__ISO_8859_1__UrlEncoded';
import { KeyValuePair } from '@/common/types/KeyValuePair';

const EMPTY_PARAM = Symbol('post__ISO8859_1.EMPTY_PARAM');
type DataFormats = FormData | KeyValuePair[] | Iterable<KeyValuePair>;

type HeadersFormat = Record<string, string>;

export function post__ISO8859_1(
  url: string | URL,
  data: DataFormats,
): Promise<Response>;
export function post__ISO8859_1(
  url: string | URL,
  headers: HeadersFormat,
  data: DataFormats,
): Promise<Response>;

export function post__ISO8859_1(
  url: string | URL,
  data_or_headers: HeadersFormat | DataFormats,
  data: DataFormats | typeof EMPTY_PARAM = EMPTY_PARAM,
): Promise<Response> {
  const headers = {
    'Content-type': 'application/x-www-form-urlencoded; encoding=iso-8859-1',
  };

  if (data === EMPTY_PARAM) data = data_or_headers as DataFormats;
  else Object.assign(headers, data_or_headers);

  const referrer =
    Object.entries(headers)
      .map(([header, value]) => [header.toLowerCase(), value])
      .findLast(([header]) => header === 'referer')?.[1] ?? null;

  const requestInit: RequestInit = {
    method: 'POST',
    headers,
    body: to__ISO_8859_1__UrlEncoded(data),
  };

  if (referrer) requestInit.referrer = referrer;

  return fetch(url, requestInit);
}
