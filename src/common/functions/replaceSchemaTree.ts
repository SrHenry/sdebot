import { KeyValueArray } from '@/common/types/KeyValueArray';
import { StringKeyRecord } from '@/common/types/StringKeyRecord';
import {
  GenericStruct,
  type TypeGuard,
  getStructMetadata,
  object,
} from '@srhenry/type-utils';

type ReplacedKeysTree<TOrigin extends {}, TReplace extends {}> = {
  [K in keyof TReplace]: K extends keyof TReplace
    ? TypeGuard<TReplace[K]>
    : K extends keyof TOrigin
    ? TypeGuard<TOrigin[K]>
    : never;
};

export function replaceSchemaTree<TOrigin extends {}, TReplace extends {}>(
  schema: TypeGuard<TOrigin>,
  tree: ReplacedKeysTree<TOrigin, TReplace>,
): TypeGuard<Prettify<Omit<TOrigin, keyof TReplace> & TReplace>> {
  const _struct = getStructMetadata(schema);

  if (_struct.type !== 'object')
    throw new Error('schema must be an object schema');

  const baseTree = Object.entries<Record<string, GenericStruct<any>>>(
    _struct.tree,
  )
    .filter(([key]) => !(key in tree))
    .map(([key, value]) => ({
      [key]: value.schema,
    })) as unknown as KeyValueArray<string, TypeGuard>;

  Object.entries<StringKeyRecord<TypeGuard>>(tree).forEach(e =>
    baseTree.push(e),
  );

  const newTree = baseTree.reduce(
    (o, [k, v]) => Object.assign(o, { [k]: v }),
    {} as StringKeyRecord<TypeGuard>,
  );

  return object(newTree) as TypeGuard<
    Prettify<Omit<TOrigin, keyof TReplace> & TReplace>
  >;
}
