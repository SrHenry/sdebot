// p42:ignore-file
declare global {
  ///? MACROS:

  declare const defaultMemory: import('@/diario-seduc/types/MemoryFile').RawMemoryFile;
  declare const mode: 'queued' | 'normal';

  declare const INTERVAL: number;
  declare const CONSUMER_SLEEP_INTERVAL: number;
  declare const RATE_LIMIT: number;
  declare const CONCURRENCY: number;

  ///? END;
}

export {};
