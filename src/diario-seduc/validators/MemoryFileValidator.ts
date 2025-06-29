import { MemoryFile, RawMemoryFile } from '@/diario-seduc/types/MemoryFile';
import { Experimental } from '@srhenry/type-utils';

export class MemoryFileValidator {
  private constructor() {}

  public static validateParsedMemory(memory: unknown): MemoryFile {
    return Experimental.validate(memory, MemoryFile);
  }
  public static validateRawMemory(memory: unknown): RawMemoryFile {
    return Experimental.validate(memory, RawMemoryFile);
  }
}
