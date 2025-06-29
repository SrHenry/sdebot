import { prepareContent } from '@/diario-seduc/functions/prepareContent';
import { Context } from '@/diario-seduc/types/Context';

export async function prepareAllContents(conteudos: string[], root = document) {
  const allContents: Context[] = [];

  for (const [i, tr] of root
    .querySelectorAll('html > body > .container tbody > tr')
    .entries() ?? []) {
    const a = tr.querySelector<HTMLAnchorElement>('td > a');

    if (a === null && tr.querySelectorAll('td > div > a').length === 2) {
      // Already insert, skip row
      continue;
    }

    const _date = tr.querySelectorAll('td')[1];

    if (!a || !_date) throw new Error('`a` and/or `_data` is null|undefined');

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
