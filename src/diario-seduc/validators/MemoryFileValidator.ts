import { Experimental } from '@srhenry/type-utils';

import type { MemoryFile, RawMemoryFile } from '../types/MemoryFile';

import {
  MemoryFile as MemoryFileSchema,
  RawMemoryFile as RawMemoryFileSchema,
} from '@/diario-seduc/schemas/MemoryFile';

export class MemoryFileValidator {
  private constructor() {}

  public static validateParsedMemory(memory: unknown): MemoryFile {
    return Experimental.validate(memory, MemoryFileSchema());
  }
  public static validateRawMemory(memory: unknown): RawMemoryFile {
    return Experimental.validate(memory, RawMemoryFileSchema());
  }
}
