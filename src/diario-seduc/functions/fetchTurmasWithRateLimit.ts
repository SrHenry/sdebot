import { fetchDocument } from '@/common/functions/fetchDocument';
import { sleep } from '@/common/functions/sleep';

export async function fetchTurmasWithRateLimit(urls: string[], limit = 1) {
  const documents: Document[] = [];
  const startTime = Date.now();
  let count = 0;

  for (let rounds = Math.ceil(urls.length / limit); rounds > 0; rounds--) {
    const batch =
      rounds == 1 ? urls.slice(count) : urls.slice(count, count + limit);

    await Promise.all(batch.map(url => fetchDocument(url))).then(docs => {
      documents.push(...docs);
      count += batch.length;
    });

    const tleft = startTime + INTERVAL - Date.now();

    if (tleft > 0) await sleep(tleft);
  }

  return documents;
}
