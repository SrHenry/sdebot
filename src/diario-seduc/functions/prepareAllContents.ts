import type { Context } from '../types/Context';
import { prepareContent } from './prepareContent';

export async function prepareAllContents(conteudos: string[], root = document) {
  const allContents: Context[] = [];

  for (const [i, tr] of root
    .querySelectorAll('html > body > .container tbody > tr')
    .entries() ?? []) {
    const a = tr.querySelector('td > a') as HTMLAnchorElement | null;

    if (a === null && tr.querySelectorAll('td > div > a').length === 2) {
      // Already insert, skip row
      continue;
    }

    const _date = tr.querySelectorAll('td')[1];

    if (!a || !_date) throw new Error('_data is null|undefined');

    const url = a.href;
    const date = _date.innerText.replace(
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
      '$3-$2-$1',
    );

    const context = await prepareContent(url, date, conteudos[i]);
    allContents.push(context);
  }

  return allContents;
}
