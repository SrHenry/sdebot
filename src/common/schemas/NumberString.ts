import { createInlineRule, string } from '@srhenry/type-utils';

export const NumberString = () =>
  string()
    .nonEmpty()
    .use(
      createInlineRule(
        'SDEBot.Custom.String.NumberString',
        o => !Number.isNaN(Number(o)),
      ),
    );
