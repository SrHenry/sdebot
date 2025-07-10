import { asEnum, number, object } from '@srhenry/type-utils';

import { RawMemoryFile } from '@/diario-seduc/schemas/MemoryFile';

export const MacrosSchema = () =>
  object({
    defaultMemory: RawMemoryFile(),
    mode: asEnum(['queued', 'normal'] as const),
    INTERVAL: number(),
    CONSUMER_SLEEP_INTERVAL: number(),
    RATE_LIMIT: number(),
    CONCURRENCY: number(),
  });
