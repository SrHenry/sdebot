import type { MemoryFile, RawMemoryFile } from '../types/MemoryFile';

import {
  MemoryFile as MemoryFileSchema,
  RawMemoryFile as RawMemoryFileSchema,
} from '@/diario-seduc/schemas/MemoryFile';

const parsedMemoryValidator = MemoryFileSchema().validator();
const rawMemoryValidator = RawMemoryFileSchema().validator();

export const MemoryFileValidator = {
  validateParsedMemory: (memory: unknown): MemoryFile =>
    parsedMemoryValidator.validate(memory),
  validateRawMemory: (memory: unknown): RawMemoryFile =>
    rawMemoryValidator.validate(memory),
};
