import type { RawMemoryFile } from '@/diario-seduc/types/MemoryFile';

import { MemoryFileValidator } from '@/diario-seduc/validators/MemoryFileValidator';

export const ensureMemoryIntegrity = (
  memory: Record<string, unknown>,
): RawMemoryFile => MemoryFileValidator.validateRawMemory(memory);
