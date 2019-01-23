// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

export type redirectType = (
  urlPattern: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

export type routeDataType = {
  routePath: $ReadOnlyArray<string>,
  filePath: string,
};

export default (folderPath: string, redirect: redirectType) =>
  d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .map(
      ({
        data: { name, path: filePath },
      }: d3DirTreeNodeType): routeDataType => {
        const relativePath = path
          .relative(folderPath, filePath)
          .replace(/\.jsx?$/, '');

        return {
          routePath: redirect([
            relativePath.replace(/(\/?index)?$/, '').replace(/^/, '/'),
          ]),
          filePath,
        };
      },
    );
