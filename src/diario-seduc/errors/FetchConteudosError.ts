import { BaseError } from '@/common/errors/BaseError';

export class FetchConteudosError<
  TContext extends Record<string, any> = {},
  TCause extends Error = Error,
> extends BaseError<TContext, TCause> {}
