import type { EnvSchema } from '@/build/schemas/Env';

export type Env = GetTypeFromSchema<typeof EnvSchema>;
