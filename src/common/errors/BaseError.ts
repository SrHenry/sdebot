/**
 * BaseError — subclass-preserving fluent error with typed context & cause.
 */

import util from 'node:util';
import { type Merge, deepMerge } from '../functions/deepMerge';

/**
 * BaseError
 *
 * @template TContext - shape of this.context
 * @template TCause   - typed cause (narrow view of Error.cause)
 * @template Self     - concrete subclass type (F-bounded); defaults to `this`-like behavior
 */
export class BaseError<
  TContext extends Record<string, any> = {},
  TCause extends Error | undefined = never,
  Self extends BaseError<any, any, any> = BaseError<TContext, TCause, any>,
> extends Error {
  readonly context: TContext;
  declare readonly cause?: TCause;

  constructor(message: string);
  constructor(
    message: string,
    options: {
      context?: TContext;
      cause?: TCause;
    },
  );
  constructor(
    message: string,
    options: {
      context?: TContext;
      cause?: TCause;
    } = {},
  ) {
    // exactOptionalPropertyTypes-safe cause passing
    if (Object.prototype.hasOwnProperty.call(options, 'cause')) {
      super(message, { cause: options.cause });
    } else {
      super(message);
    }

    this.name = this.constructor.name;
    this.context = (options.context ?? {}) as TContext;
  }

  // -------------------------
  // Protected clone hook
  // -------------------------
  /**
   * Subclasses may override to mutate the provided clone. The parameter is `this`
   * (polymorphic) so subclass authors get proper typing without hacks.
   */
  protected cloneHook(_clone: this): void {
    // noop by default
  }

  // -------------------------
  // Internal clone engine
  // -------------------------
  /**
   * Creates a cloned instance of the same concrete subclass (polymorphically),
   * preserving runtime instance fields and respecting exactOptionalPropertyTypes
   * when passing `cause` to the native Error constructor.
   *
   * Returns the clone typed as `this` (polymorphic `this`), so callers preserve subclass types.
   */
  protected _clone<
    NewContext extends Record<string, any> = TContext,
    NewCause extends Error | undefined = TCause,
  >(opts: {
    message?: string;
    name?: string;
    context?: NewContext;
    cause?: NewCause;
    stack?: string;
  }): this {
    // Use the runtime constructor to build the same concrete subclass.
    const Ctor = this.constructor as new (
      message: string,
      o?: { context?: any; cause?: any },
    ) => any;

    // Decide cause semantics respecting exactOptionalPropertyTypes
    const causeProvidedInArgs = Object.prototype.hasOwnProperty.call(
      opts,
      'cause',
    );
    const hasCauseOnThis = Object.prototype.hasOwnProperty.call(this, 'cause');

    const computedOpts: { context?: any; cause?: any } = {
      context: opts.context ?? (this.context as any),
      ...(causeProvidedInArgs
        ? { cause: (opts as any).cause }
        : hasCauseOnThis
        ? { cause: (this as any).cause }
        : {}),
    };

    // Construct a new instance of the same subclass
    const created = new Ctor(
      opts.message ?? (this.message as string),
      computedOpts,
    );

    // Cast to `this` polymorphically — this is safe because we constructed with the same ctor
    const clone = created as this;

    // Copy runtime own enumerable properties (subclass instance fields)
    try {
      Object.assign(clone, this);
    } catch {
      /* ignore */
    }

    // Apply explicit overrides
    if (opts.name) {
      (clone as any).name = opts.name;
    } else {
      (clone as any).name = (this as any).name ?? (clone as any).name;
    }

    if (opts.stack) {
      try {
        (clone as any).stack = opts.stack;
      } catch {
        /* ignore */
      }
    } else if ('stack' in this) {
      try {
        (clone as any).stack = (this as any).stack;
      } catch {
        /* ignore */
      }
    }

    // Ensure canonical context (ctor already got it, but set to be safe)
    (clone as any).context = computedOpts.context ?? (this.context as any);

    // If cause was explicitly provided in opts, set it on clone as runtime property
    if (causeProvidedInArgs) {
      if (Object.prototype.hasOwnProperty.call(computedOpts, 'cause')) {
        try {
          (clone as any).cause = (computedOpts as any).cause;
        } catch {
          /* ignore */
        }
      }
    }

    // Call the subclass hook with correct `this`-typed clone
    try {
      // cloneHook expects `this` type; calling directly is proper typing-wise
      (this.cloneHook as (c: this) => void).call(this, clone);
    } catch {
      /* extensions must not throw during clone */
    }

    return clone;
  }

  // -------------------------
  // Fluent API (polymorphic returns)
  // -------------------------
  withContext<TAdded extends Record<string, any>>(
    added: TAdded,
  ): BaseError<Merge<TContext, TAdded>, TCause, Self> & this {
    // deep merge then return clone
    const merged = deepMerge(
      this.context as Record<string, any>,
      added,
    ) as Merge<TContext, TAdded>;
    return this._clone({ context: merged }) as BaseError<
      Merge<TContext, TAdded>,
      TCause,
      Self
    > &
      this;
  }

  withCause<NewCause extends Error>(
    cause: NewCause,
  ): BaseError<TContext, NewCause, Self> & this {
    return this._clone({ cause }) as BaseError<TContext, NewCause, Self> & this;
  }

  causedBy<NewCause extends Error>(
    cause: NewCause,
  ): BaseError<TContext, NewCause, Self> & this {
    return this.withCause(cause);
  }

  withMessage(message: string): this {
    return this._clone({ message });
  }

  withName(name: string): this {
    return this._clone({ name });
  }

  withStack(stack: string): this {
    return this._clone({ stack });
  }

  // -------------------------
  // Cause chain utilities
  // -------------------------
  rootCause(): Error {
    let err: any = this;
    const seen = new Set<Error>();
    while (err && err.cause && !seen.has(err.cause)) {
      seen.add(err);
      err = err.cause;
    }
    return err;
  }

  flattenCauses(): Error[] {
    const chain: Error[] = [];
    let err: any = this;
    const seen = new Set<Error>();
    while (err && !seen.has(err)) {
      chain.push(err);
      seen.add(err);
      err = err.cause;
    }
    return chain;
  }

  fullContext(): Record<string, any> {
    const chain = this.flattenCauses();
    let result: Record<string, any> = {};
    for (const e of chain) {
      if (e instanceof BaseError) {
        result = deepMerge(result, (e as BaseError<any, any>).context);
      }
    }
    return result;
  }

  prettyStack(): string {
    const chain = this.flattenCauses();
    return chain
      .map(
        err =>
          `${err.name}: ${err.message}` +
          (err.stack ? '\n' + err.stack.split('\n').slice(1).join('\n') : ''),
      )
      .join('\n\nCaused By:\n\n');
  }

  toJSON(): Record<string, any> {
    const base: Record<string, any> = {
      name: this.name,
      message: this.message,
      context: this.context,
    };

    if (Object.prototype.hasOwnProperty.call(this, 'cause')) {
      base.cause = (this as any).cause;
    }

    if ('stack' in this) {
      base.stack = (this as any).stack;
    }

    return base;
  }

  [util.inspect.custom](_depth: number, _options: util.InspectOptionsStylized) {
    const base: Record<string, unknown> = {
      name: this.name,
      message: this.message,
    };

    if (Object.prototype.hasOwnProperty.call(this, 'cause')) {
      base.cause = this.cause;
    }

    if (this.context && Object.keys(this.context).length > 0) {
      base.context = this.context;
    }

    if ('stack' in this) {
      base.stack = this.stack;
    }

    return base;
  }
}
