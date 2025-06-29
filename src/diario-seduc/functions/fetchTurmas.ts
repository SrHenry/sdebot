import { fetchDocument } from '@/common/functions/fetchDocument';

export function fetchTurmas(urls: string[] | URL[]) {
  return Promise.all(urls.map(fetchDocument));
}
