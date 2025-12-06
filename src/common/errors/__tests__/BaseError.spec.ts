import { BaseError } from '../BaseError';

describe('BaseError', () => {
  class XError extends BaseError<{ x: number }> {
    override name = 'XError';
    customField = 123;
  }

  class PError extends BaseError<{ p: string }, Error | undefined> {
    override name = 'PError';
  }

  // -------------------------------------------------------------
  // Base constructor & context
  // -------------------------------------------------------------

  it('stores message and context', () => {
    const err = new XError('boom', { context: { x: 1 } });
    expect(err.message).toBe('boom');
    expect(err.context).toEqual({ x: 1 });
  });

  // -------------------------------------------------------------
  // withContext — type-safe context extension
  // -------------------------------------------------------------

  it('extends context and preserves type', () => {
    const err = new XError('boom', { context: { x: 1 } });

    const next = err.withContext({ a: { y: 2 }, b: 42 });

    expect(next.context).toEqual({
      x: 1,
      a: { y: 2 },
      b: 42,
    });

    // next is NOT XError anymore; cannot access subclass fields
    next.customField;
  });

  it('refuses invalid context keys at compile time', () => {
    // @ts-expect-error `a` does not exist in {x: number}
    new XError('bad', { context: { x: 1, a: 2 } });
  });

  // -------------------------------------------------------------
  // withMessage
  // -------------------------------------------------------------

  it('returns new instance with updated message', () => {
    const err = new XError('boom', { context: { x: 1 } });
    const next = err.withMessage('updated');

    expect(next.message).toBe('updated');
    expect(next.context).toEqual({ x: 1 });
  });

  // -------------------------------------------------------------
  // withCause — typed cause upgrades
  // -------------------------------------------------------------

  it('adds a cause with proper typing', () => {
    const err = new XError('boom', { context: { x: 1 } });
    const cause = new Error('root');
    const next = err.withCause(cause);

    expect(next.cause).toBe(cause);
    expect(next.context).toEqual({ x: 1 });
  });

  // -------------------------------------------------------------
  // withName — override error name
  // -------------------------------------------------------------

  it('returns new instance with changed name', () => {
    const err = new XError('boom', { context: { x: 1 } });
    const next = err.withName('RENAMED');

    expect(next.name).toBe('RENAMED');
    expect(err.name).toBe('XError');
  });

  // -------------------------------------------------------------
  // cloneHook — custom subclass cloning behavior
  // -------------------------------------------------------------

  class HookedError extends BaseError<{ p: string }> {
    override name = 'HookedError';
    extraA = 1;
    extraB = 2;

    protected override cloneHook(target: this): void {
      target.extraA = this.extraA;
      target.extraB = this.extraB;
    }
  }

  it('supports cloneHook inheritance for cloning', () => {
    const err = new HookedError('msg', { context: { p: 'ok' } });
    err.extraA = 10;
    err.extraB = 20;

    const next = err.withMessage('new') as HookedError;

    expect(next.extraA).toBe(10);
    expect(next.extraB).toBe(20);
    expect(next.context).toEqual({ p: 'ok' });
  });

  // -------------------------------------------------------------
  // rootCause & flattenCauses
  // -------------------------------------------------------------

  it('walks the cause chain to determine root cause', () => {
    const a = new Error('A');
    const b = new PError('B', { context: { p: '1' }, cause: a });
    const c = b.withCause(new Error('C'));

    expect(c.rootCause().message).toBe('C');
  });

  it('returns full cause chain in order', () => {
    const a = new Error('A');
    const b = new PError('B', { context: { p: '1' }, cause: a });
    const c = b.withCause(new Error('C'));

    const chain = c.flattenCauses().map(e => e.message);
    expect(chain).toEqual(['B', 'C']);
  });

  // -------------------------------------------------------------
  // fullContext — merges context across chain
  // -------------------------------------------------------------

  it('collects merged context across cause chain', () => {
    const a = new PError('A', { context: { p: 'one' } });
    const b = a.withContext({ q: 2 });
    const c = b.withContext({ r: true });

    expect(c.fullContext()).toEqual({
      p: 'one',
      q: 2,
      r: true,
    });
  });
});
