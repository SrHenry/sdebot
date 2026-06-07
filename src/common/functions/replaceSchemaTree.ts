import {
  type FluentSchema,
  type Validators,
  getStructMetadata,
  object,
} from '@srhenry/type-utils';

type ReplacedSchema<TOrigin extends {}, TReplace extends {}> = Omit<
  TOrigin,
  keyof TReplace
> &
  TReplace;

export function replaceSchemaTree<TOrigin extends {}, TReplace extends {}>(
  schema: FluentSchema<TOrigin>,
  tree: Validators.ValidatorMap<TReplace>,
): FluentSchema<Prettify<ReplacedSchema<TOrigin, TReplace>>> {
  const _struct = getStructMetadata(schema);

  if (_struct.type !== 'object')
    throw new Error('schema must be an object schema');

  const newTree = Object.assign(
    {},
    _struct.tree as Validators.ValidatorMap<TOrigin>,
    tree,
  ) as unknown as Validators.ValidatorMap<ReplacedSchema<TOrigin, TReplace>>;

  return object(newTree) as unknown as FluentSchema<
    ReplacedSchema<TOrigin, TReplace>
  >;
}
