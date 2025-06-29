import { debug } from '@/common/functions/debug';
import { fetchConteudos } from '@/diario-seduc/functions/fetchConteudos';
import { IMemory } from '@/diario-seduc/types/IMemory';
import { MemoryFile } from '@/diario-seduc/types/MemoryFile';

/**
 * Check if the memory needs to fetch conteudos from SDE, then fetch on the fly
 */
export const fetchMissingConteudosFromMemory = async ({
  conteudos,
  turmas,
}: MemoryFile) => {
  debug(
    '[fetchMissingConteudosFromMemory::Function] >> Checking if conteudos need to be fetched...',
  );

  const memory = {
    turmas,
    conteudos: {},
  } as IMemory;

  for (const [key, value] of Object.entries(conteudos)) {
    if (value instanceof URL) {
      debug(
        `[fetchMissingConteudosFromMemory::Function] >> Fetching conteudos for "${key} "from URL: ${key}`,
      );

      try {
        const conteudos = await fetchConteudos(value.toString());
        memory.conteudos[key] = conteudos;

        debug(
          `[fetchMissingConteudosFromMemory::Function] >> Fetched conteudos: ${conteudos}`,
        );
      } catch (error) {
        debug(
          `[fetchMissingConteudosFromMemory::Function] >> Error fetching conteudos:`,
          error,
        );

        throw new Error(`Failed to fetch conteudos from URL: ${key}`);
      }
    } else memory.conteudos[key] = value;
  }

  return memory;
};
