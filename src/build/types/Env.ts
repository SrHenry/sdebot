import { NumberString } from '@/common/schemas/NumberString';
import { asEnum, object, string } from '@srhenry/type-utils';

export const EnvSchema = () =>
  object({
    MEMORY_DATA_PATHS: string(),
    MODE: asEnum(['queued', 'normal'] as const),

    INTERVAL: NumberString(),
    CONSUMER_SLEEP_INTERVAL: NumberString(),
    RATE_LIMIT: NumberString(),
    CONCURRENCY: NumberString(),

    /** debugging: */
    __DEBUG__: asEnum.optional(['true', 'false'] as const),
  });

export type Env = GetTypeFromSchema<typeof EnvSchema>;
