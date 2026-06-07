import { EnvSchema } from '@/build/schemas/Env';
import type { Env } from '@/build/types/Env';

const validator = EnvSchema().validator();

export const EnvironmentValidator = {
  validateEnv: (env: unknown): Env => validator.validate(env),
};
