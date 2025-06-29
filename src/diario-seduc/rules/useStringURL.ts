import { createRule } from '@srhenry/type-utils';

const isStringURL = (value: string): value is string => {
  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
};

export const useStringURL = createRule({
  name: 'custom.String.URL',
  message: '[rule: must be an valid URL string]',
  handler: (subject: string) => () => isStringURL(subject),
});
