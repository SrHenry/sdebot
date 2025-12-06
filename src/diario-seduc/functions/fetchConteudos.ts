import { fetchDocument } from '@/common/functions/fetchDocument';
import { FetchConteudosError } from '@/diario-seduc/errors/FetchConteudosError';

export async function fetchConteudos(url: string | URL): Promise<string[]> {
  const document = await fetchDocument(url);

  //selecionar a tabela contendo o conteudo:
  const tbody = document.querySelector(
    'html > body > div > table:nth-of-type(2) > tbody',
  );

  if (!tbody)
    throw new FetchConteudosError('Tabela de conteudos não encontrada')
      .withContext({
        params: [url],
      })
      .withContext({
        stack: {
          document,
          tbody,
        },
      });

  const trs = [...tbody.querySelectorAll('tr')];

  if (!trs.length)
    throw new FetchConteudosError('Tabela de conteudos não possui linhas')
      .withContext({
        params: [url],
      })
      .withContext({ stack: { document, tbody, trs } });

  return trs.map(tr => tr.querySelectorAll('td')[2].innerText);
}
