import { MemoryFile, RawMemoryFile } from '@/diario-seduc/schemas/MemoryFile';

export type MemoryFile = GetTypeFromSchema<typeof MemoryFile>;
export type RawMemoryFile = GetTypeFromSchema<typeof RawMemoryFile>;
