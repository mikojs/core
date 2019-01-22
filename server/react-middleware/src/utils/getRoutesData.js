// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

export type redirectType = (
  urlPattern: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

export type routeDataType = {
  routePath: string,
  filePath: string,
};

export default (folderPath: string, redirect: redirectType) =>
  d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .reduce((
      result: $ReadOnlyArray<routeDataType>,
      { data: { name, path: filePath } }: d3DirTreeNodeType,
    ): $ReadOnlyArray<routeDataType> => {
      const relativePath = path
        .relative(folderPath, filePath)
        .replace(/\.jsx?$/, '');

      return [
        ...result,
        ...redirect([
          relativePath.replace(/(index)?$/, '').replace(/^/, '/'),
        ]).map((routePath: string) => ({
          routePath,
          filePath,
        })),
      ];
    }, []);
