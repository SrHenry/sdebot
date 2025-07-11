import { fetchAlunos } from '@/diario-seduc/functions/fetchAlunos';
import { Context } from '@/diario-seduc/types/Context';

export async function prepareContent(
  url: string,
  date: string,
  conteudo = '',
): Promise<Context> {
  const q = new URLSearchParams(url.split('?')[1]);
  const alunos = await fetchAlunos(url);

  return {
    url,
    q: [...q.entries()],
    payload: {
      data_chamada: date,
      [`conteudo[${q.get('dd')}]`]: conteudo,
      ...alunos.reduce((o, aluno) => {
        return {
          ...o,
          [`freq[${q.get('dd')}][${aluno}]`]: 'P',
          [`tipoAula[${q.get('dd')}][${aluno}]`]: '7',
        };
      }, {}),
    },
  };
}
