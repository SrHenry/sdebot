import { GroupFactory } from '../GroupFactory';
import type { Memory } from '../types/Memory';

export function group(obj: Memory): GroupFactory {
  return new GroupFactory(obj);
}
