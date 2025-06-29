import { Collection } from '@/common/types/Collection';
import { DataSets } from '@/common/types/DataSet';
import { GroupSet } from '@/common/types/GroupSet';

export class GroupFactory<T extends Collection> {
  constructor(private obj: T) {}
  private groupFromEntries(datasets: DataSets<T>) {
    const result = {} as GroupSet<T>;

    for (const [groupKey, dataset] of datasets) {
      for (const [key, values] of dataset) {
        if (key in result) {
          result[key][groupKey] = values;
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

  public by<K extends keyof T>(...groupKeys: K[]): GroupSet<T> {
    const datasets = groupKeys.map(key => [
      key,
      Object.entries(this.obj[key]),
    ]) as DataSets<T>;

    return this.groupFromEntries(datasets);
  }
}
