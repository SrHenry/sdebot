import { MemoryFileValidator } from '@/diario-seduc/validators/MemoryFileValidator';

export const ensureMemoryIntegrity = (memory: Record<string, unknown>) => {
  return MemoryFileValidator.validateRawMemory(memory);
};
