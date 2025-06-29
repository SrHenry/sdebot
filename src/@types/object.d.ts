declare global {
  declare type ObjectKeys<T> = T extends object
    ? (keyof T)[]
    : T extends number
    ? []
    : T extends Array<any> | string
    ? string[]
    : never;

  declare type Fallback<T, TO, Includes = never> = T extends never | Includes
    ? TO
    : T;

  declare type ObjectEntry<T extends {}> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T];
  declare type ObjectEntries<T extends {}> = ObjectEntry<T>[];
  declare type Entry<T> = T extends any[]
    ? T
    : T extends {}
    ? ObjectEntry<T>
    : [string, any];
  declare type Entries<T> = T extends any[]
    ? T
    : T extends {}
    ? ObjectEntries<T>
    : [string, any][];

  declare type ObjectValue<T> = T extends any[]
    ? T
    : T extends {}
    ? ObjectEntry<T> extends [any, infer TValue]
      ? TValue
      : never
    : never;

  declare type ObjectValues<T extends {}> = ObjectValue<T>[];
  declare type Value<T> = T extends any[]
    ? T
    : T extends {}
    ? ObjectValue<T>
    : any[];
  declare type Values<T> = T extends any[]
    ? T
    : T extends {}
    ? ObjectValues<T>
    : any[];

  declare interface ObjectConstructor {
    keys<T>(o: T): (keyof T)[];
    keys<T>(o: T): Fallback<ObjectKeys<T>, string[], never[]>;
    // entries<T extends object>(o: T): [keyof T, T[keyof T]][]
    entries<T extends {}>(o: T): ObjectEntries<T>;
    // entries<T>(o: ArrayLike<T>): [string, T][]
    values<T>(o: T): T[keyof T][];
  }

  declare const Object: ObjectConstructor;

  declare interface ArrayConstructor {
    isArray<T = any>(arg: any): arg is T[];
  }

  declare var Array: ArrayConstructor;

  declare type TypeOfTag =
    | 'undefined'
    | 'boolean'
    | 'string'
    | 'number'
    | 'bigint'
    | 'symbol'
    | 'object'
    | 'function';
}

export {};
