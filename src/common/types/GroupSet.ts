import { Collection } from '@/common/types/Collection';

export type GroupSet<T extends Collection> = {
  [Group in keyof T[keyof T]]: {
    [Kind in keyof T]: T[Kind][Group];
  };
};
