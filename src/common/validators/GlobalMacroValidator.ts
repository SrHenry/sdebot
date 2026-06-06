import { MacrosSchema } from '@/common/schemas/Macros';
import { __MACROS__ } from '@/common/types/global.MACROS';

type GlobalMacroValidatorArgType = {
  [key in keyof __MACROS__]: unknown;
};

const MacrosValidator = MacrosSchema().validator();

export const GlobalMacroValidator = {
  validateGlobalMacros: (macros: GlobalMacroValidatorArgType): __MACROS__ =>
    MacrosValidator.validate(macros),
};
