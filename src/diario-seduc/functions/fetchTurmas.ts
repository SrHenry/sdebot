import { fetchDocument } from '@/common/functions/fetchDocument';

export function fetchTurmas(urls: string[]) {
  return Promise.all(urls.map(fetchDocument));
}
