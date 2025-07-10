import { replaceSchemaTree } from '@/common/functions/replaceSchemaTree';
import { StringArrayRecord } from '@/common/schemas/StringArrayRecord';
import { MemoryFile } from '@/diario-seduc/schemas/MemoryFile';

// export type IMemory = Omit<MemoryFile, 'conteudos'> & {
//   conteudos: Record<string, string[]>;
// };

export const Memory = () =>
  replaceSchemaTree(MemoryFile(), {
    conteudos: StringArrayRecord(),
  });

// export const MemorySchema = object<IMemory>({
//   conteudos: StringArrayRecord(),
//   turmas: StringKeyRecord(array(isInstanceOf(URL))),
// });
