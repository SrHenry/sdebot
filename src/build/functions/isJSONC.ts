/**
 * Checks if a given file path ends with `.jsonc`.
 */
export const isJSONC = (path: string) => /.*\.jsonc$/.test(path);
