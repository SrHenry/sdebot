import type { Memory } from '@/diario-seduc/types/Memory';
import type { MemoryFile } from '@/diario-seduc/types/MemoryFile';

import { debug } from '@/common/functions/debug';
import { FetchConteudosError } from '@/diario-seduc/errors/FetchConteudosError';
import { fetchConteudos } from '@/diario-seduc/functions/fetchConteudos';

/**
 * Check if the memory needs to fetch conteudos from SDE, then fetch on the fly
 */
export const fetchMissingConteudosFromMemory = async ({
  conteudos,
  turmas,
}: MemoryFile): Promise<Memory> => {
  debug(
    '[fetchMissingConteudosFromMemory::Function] >> Checking if conteudos need to be fetched...',
  );

  const memory = {
    turmas,
    conteudos: {},
  } as Memory;

  for (const [key, value] of Object.entries(conteudos)) {
    if (value instanceof URL) {
      debug(
        `[fetchMissingConteudosFromMemory::Function] >> Fetching conteudos for "${key} "from URL:`,
        { key, value },
      );

      try {
        const conteudos = await fetchConteudos(value);

        memory.conteudos[key] = conteudos;

        debug(
          `[fetchMissingConteudosFromMemory::Function] >> Fetched conteudos:`,
          { conteudos },
        );
      } catch (error: unknown) {
        debug(
          `[fetchMissingConteudosFromMemory::Function] >> Error fetching conteudos:`,
          { error },
        );

        throw new FetchConteudosError(`Failed to fetch conteudos from URL`)
          .withContext({ params: [{ conteudos, turmas }] })
          .withContext({
            stack: {
              memory,
            },
          })
          .withContext({
            stack: {
              [Symbol.for('__for__of')]: {
                item: [key, value],
                from: Object.entries(conteudos),
              },
            },
          })
          .withCause(error as Error);
      }
    } else {
      memory.conteudos[key] = value;
    }
  }

  return memory;
};
