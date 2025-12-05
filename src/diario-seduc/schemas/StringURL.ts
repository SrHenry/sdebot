import { string } from '@srhenry/type-utils';

// export const StringURL = () => useCustomRules(string(), useStringURL());
export const StringURL = () => string().url();
