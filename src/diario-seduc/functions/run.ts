import { debug } from '@/common/functions/debug';
import type { Memory } from '../types/Memory';
import { fetchTurmas } from './fetchTurmas';
import { group } from './group';
import { postContent } from './postContent';
import { prepareAllContents } from './prepareAllContents';

export async function run(memory: Memory) {
  debug('[run::Function] >> Starting...');

  /** @type {Response[][]} */
  const responsesGroups = [];

  const bims = group(memory).by('conteudos', 'turmas');

  debug('[run::Function] >> Ready!', { memory, bims });

  for (const [bim, { conteudos, turmas: urls }] of Object.entries(bims)) {
    debug(`[run::Function] >> [bim::const::for (${bim})]`, { conteudos, urls });

    const turmas = await fetchTurmas(urls);
    const preparedContents = await Promise.all(
      turmas.map(turma => prepareAllContents(conteudos, turma)),
    );

    debug(`[run::Function] >> [bim::string::for (${bim})]`, {
      preparedContents,
    });

    const responses = await Promise.all(
      preparedContents.flat().map(postContent),
    );

    debug(`[run::Function] >> [bim::string::for (${bim})]`, {
      responses,
    });

    responsesGroups.push(responses);
  }

  debug('[run::Function]: Finished!');
}
