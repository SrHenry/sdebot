import { GroupFactory } from '@/common/GroupFactory';
import { Collection } from '@/common/types/Collection';

export function group<T extends Collection>(obj: T) {
  return new GroupFactory(obj);
}
