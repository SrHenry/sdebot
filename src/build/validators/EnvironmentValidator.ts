import { type Env, EnvSchema } from '@/build/types/Env';
import { Experimental } from '@srhenry/type-utils';

export class EnvironmentValidator {
  private constructor() {}

  public static validateEnv(env: unknown): Env {
    return Experimental.validate(env, EnvSchema);
  }
}
