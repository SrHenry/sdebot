import { useStringURL } from '@/diario-seduc/rules/useStringURL';
import { string, useCustomRules } from '@srhenry/type-utils';

export const StringURL = () => useCustomRules(string(), useStringURL());
