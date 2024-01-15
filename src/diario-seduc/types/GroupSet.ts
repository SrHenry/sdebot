import { Memory } from './Memory';

export type GroupSet<T extends Memory> = {
  [Group in keyof T[keyof T]]: {
    [Kind in keyof T]: T[Kind][Group];
  };
};
