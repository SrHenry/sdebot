import type { KeyValuePair } from '@/common/types/KeyValuePair';
import type { KeyValueArray } from '@/common/types/keyValueArray';
import type { GroupSet } from './types/GroupSet';
import type { Memory } from './types/Memory';

type DataSet<T extends Memory> = KeyValuePair<
  keyof T,
  KeyValueArray<string, string[]>
>;
type DataSets<T extends Memory> = DataSet<T>[];

export class GroupFactory {
  constructor(private obj: Memory) {}
  private groupFromEntries(datasets: DataSets<Memory>) {
    const result = {} as GroupSet<Memory>;

    for (const [groupKey, dataset] of datasets) {
      for (const [key, values] of dataset) {
        if (key in result) {
          if (groupKey in result[key]) result[key][groupKey].push(...values);
          else result[key][groupKey] = values;
        } else {
          Object.assign(result, {
            [key]: {
              [groupKey]: values,
            },
          });
        }
      }
    }

    return result;
  }

  by<K extends keyof Memory>(...groupKeys: K[]): GroupSet<Memory> {
    const datasets = groupKeys.map(key => [
      key,
      Object.entries(this.obj[key]),
    ]) as DataSets<Memory>;

    return this.groupFromEntries(datasets);
  }
}
