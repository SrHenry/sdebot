import { isJSONC } from '@/build/functions/isJSONC';
import { parseJSONC } from '@/build/functions/mappers/parseJSONC';
import { readFileSync } from 'node:fs';

export function handleMemData(path: string): Record<string, unknown> {
  if (isJSONC(path)) {
    const file = readFileSync(path).toString();
    return parseJSONC(file) as Record<string, unknown>;
  } else return require(path);
}
