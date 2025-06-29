import { MACROS, MacrosSchema } from '@/common/types/global.MACROS';
import { Experimental } from '@srhenry/type-utils';

type GlobalMacroValidatorArgType = {
  [key in keyof MACROS]: unknown;
};

export class GlobalMacroValidator {
  private constructor() {}

  public static validate(macros: GlobalMacroValidatorArgType): MACROS {
    return Experimental.validate(macros, MacrosSchema);
  }
}
