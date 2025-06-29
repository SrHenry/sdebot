import { NumberString } from '@/common/types/NumberString';
import {
  asEnum,
  GetTypeGuard,
  object,
  optional,
  string,
} from '@srhenry/type-utils';

export const EnvSchema = object({
  MEMORY_DATA_PATHS: string(),
  MODE: asEnum(['queued', 'normal'] as const),

  INTERVAL: NumberString(),
  CONSUMER_SLEEP_INTERVAL: NumberString(),
  RATE_LIMIT: NumberString(),
  CONCURRENCY: NumberString(),

  /** debugging: */
  __DEBUG__: optional().asEnum(['true', 'false'] as const),
});

export type Env = GetTypeGuard<typeof EnvSchema>;
