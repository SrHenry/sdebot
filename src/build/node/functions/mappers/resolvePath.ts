import { root } from '@/root';
import { resolve } from 'node:path';

export const resolvePath = (path: string) => resolve(root, path);
