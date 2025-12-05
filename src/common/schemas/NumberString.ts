import { createRule, string } from '@srhenry/type-utils';

const NumberStringRule = createRule({
  name: 'SDEBot.Custom.String.NumberString',
  handler: (o: string) => () => !Number.isNaN(Number(o)),
});

export const NumberString = () => string().nonEmpty().use(NumberStringRule());
