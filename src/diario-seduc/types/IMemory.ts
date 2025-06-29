import { StringArrayRecord } from '@/common/types/StringArrayRecord';
import { StringKeyRecord } from '@/common/types/StringKeyRecord';
import { MemoryFile } from '@/diario-seduc/types/MemoryFile';
import { array, isInstanceOf, object } from '@srhenry/type-utils';

export type IMemory = Omit<MemoryFile, 'conteudos'> & {
  conteudos: Record<string, string[]>;
};

export const MemorySchema = object<IMemory>({
  conteudos: StringArrayRecord(),
  turmas: StringKeyRecord(array(isInstanceOf(URL))),
});
