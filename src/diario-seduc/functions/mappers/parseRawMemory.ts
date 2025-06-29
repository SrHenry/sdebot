import { MemoryFile, RawMemoryFile } from '@/diario-seduc/types/MemoryFile';

export const parseRawMemory = (memory: RawMemoryFile): MemoryFile => {
  return {
    conteudos: Object.fromEntries(
      Object.entries(memory.conteudos).map(([key, value]) => [
        key,
        typeof value === 'string' ? new URL(value) : value,
      ]),
    ),
    turmas: Object.fromEntries(
      Object.entries(memory.turmas).map(([key, value]) => [
        key,
        value.map(url => new URL(url)),
      ]),
    ),
  };
};
