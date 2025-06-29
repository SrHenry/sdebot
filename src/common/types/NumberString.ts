import { string, StringRules, TypeGuard } from '@srhenry/type-utils';

export const NumberString = () =>
  <TypeGuard<string>>(
    (o => string([StringRules.nonEmpty()])(o) && !Number.isNaN(Number(o)))
  );
