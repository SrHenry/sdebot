import { RawMemoryFile } from '@/diario-seduc/types/MemoryFile';
import { asEnum, number, object } from '@srhenry/type-utils';

export interface MACROS {
  defaultMemory: typeof defaultMemory;
  mode: typeof mode;
  INTERVAL: typeof INTERVAL;
  CONSUMER_SLEEP_INTERVAL: typeof CONSUMER_SLEEP_INTERVAL;
  RATE_LIMIT: typeof RATE_LIMIT;
  CONCURRENCY: typeof CONCURRENCY;
}

export const MacrosSchema = object<MACROS>({
  defaultMemory: RawMemoryFile,
  mode: asEnum(['queued', 'normal'] as const),
  INTERVAL: number(),
  CONSUMER_SLEEP_INTERVAL: number(),
  RATE_LIMIT: number(),
  CONCURRENCY: number(),
});
