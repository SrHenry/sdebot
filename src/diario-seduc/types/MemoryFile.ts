import { StringArray } from '@/common/types/StringArray';
import { StringKeyRecord } from '@/common/types/StringKeyRecord';
import { StringURL } from '@/diario-seduc/types/StringURL';
import { array, isInstanceOf, object, or } from '@srhenry/type-utils';

export type MemoryFile = {
  conteudos: Record<string, string[] | URL>;
  turmas: Record<string, URL[]>;
};
export type RawMemoryFile = {
  conteudos: Record<string, string[] | string>;
  turmas: Record<string, string[]>;
};

export const MemoryFile = object<MemoryFile>({
  conteudos: StringKeyRecord(or(StringArray(), isInstanceOf(URL))),
  turmas: StringKeyRecord(array(isInstanceOf(URL))),
});

export const RawMemoryFile = object<RawMemoryFile>({
  conteudos: StringKeyRecord(or(StringArray(), StringURL())),
  turmas: StringKeyRecord(array(StringURL())),
});
