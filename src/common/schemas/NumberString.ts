import { createInlineRule, string } from '@srhenry/type-utils';

export const NumberString = () =>
  string()
    .nonEmpty()
    .use(
      createInlineRule(
        'SDEBot.Custom.String.NumberString',
        o => {
      const normalized = o.trim();
      if (normalized.length === 0) return false;
      return Number.isFinite(Number(normalized));
    },
      ),
    );
