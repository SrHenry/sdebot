import { fetchDocument } from '@/common/functions/fetchDocument';

export async function fetchConteudos(url: string | URL): Promise<string[]> {
  const document = await fetchDocument(url);

  //selecionar a tabela contendo o conteudo:
  const tbody = document.querySelector(
    'html > body > div > table:nth-child(3) > tbody',
  );

  if (!tbody) throw new Error('Tabela de conteudos não encontrada');

  const trs = [...tbody.querySelectorAll('tr')];

  if (!trs.length) throw new Error('Tabela de conteudos não possui linhas');

  const conteudos = trs.map(tr => tr.querySelectorAll('td')[2].innerText);

  return conteudos;
}
