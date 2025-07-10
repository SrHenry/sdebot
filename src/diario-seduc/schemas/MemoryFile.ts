import { array, isInstanceOf, object, or } from '@srhenry/type-utils';

import { StringArray } from '@/common/schemas/StringArray';
import { StringKeyRecord } from '@/common/schemas/StringKeyRecord';
import { StringURL } from '@/diario-seduc/schemas/StringURL';

export const MemoryFile = () =>
  object({
    conteudos: StringKeyRecord(or(StringArray(), isInstanceOf(URL))),
    turmas: StringKeyRecord(array(isInstanceOf(URL))),
  });

export const RawMemoryFile = () =>
  object({
    conteudos: StringKeyRecord(or(StringArray(), StringURL())),
    turmas: StringKeyRecord(array(StringURL())),
  });
