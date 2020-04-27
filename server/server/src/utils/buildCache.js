// @flow

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

type optionsType<R> = {|
  folderPath: string,
  callback: (data: {|
    ...$Diff<$PropertyType<d3DirTreeNodeType, 'data'>, {| path: mixed |}>,
    filePath: string,
  |}) => R,
  extensions?: RegExp,
  exclude?: RegExp,
|};

type returnType<R> = {
  [string]: R,
};

/**
 * @example
 * buildCache({ folderPath: '/', callback: () => {} })
 *
 * @param {optionsType} options - options
 *
 * @return {returnType} - cache
 */
export default <R>({
  folderPath,
  callback,
  extensions,
  exclude,
}: optionsType<R>): returnType<R> => {
  const cache = d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .reduce(
      (
        result: returnType<R>,
        { data: { path: filePath, ...data } }: d3DirTreeNodeType,
      ) => ({
        ...result,
        [filePath]: callback({
          ...data,
          filePath,
        }),
      }),
      {},
    );

  return cache;
};
