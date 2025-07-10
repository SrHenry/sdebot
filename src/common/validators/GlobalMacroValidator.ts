import { MacrosSchema } from '@/common/schemas/Macros';
import { __MACROS__ } from '@/common/types/global.MACROS';
import { Experimental } from '@srhenry/type-utils';

type GlobalMacroValidatorArgType = {
  [key in keyof __MACROS__]: unknown;
};

export class GlobalMacroValidator {
  private constructor() {}

  public static validate(macros: GlobalMacroValidatorArgType): __MACROS__ {
    return Experimental.validate(macros, MacrosSchema());
  }
}
