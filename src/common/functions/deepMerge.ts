export type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? [A[K], B[K]] extends [Record<string, any>, Record<string, any>]
        ? Merge<A[K], B[K]>
        : B[K]
      : B[K]
    : K extends keyof A
    ? A[K]
    : never;
};

function isObj(v: any): v is Record<string, any> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Function to merge two objects recursively
 *
 * @param a Base object
 * @param b Object to merge
 *
 * @returns A new object containing the merged values
 */
export function deepMerge<
  A extends Record<string, any>,
  B extends Record<string, any>,
>(a: A, b: B): Merge<A, B> {
  const out: Merge<A, B> = { ...(a as any) };

  for (const key in b) {
    const av = (a as any)[key];
    const bv = (b as any)[key];

    out[key] = isObj(av) && isObj(bv) ? deepMerge(av, bv) : bv;
  }
  return out;
}

export default deepMerge;
