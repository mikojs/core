// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import templates from 'templates';

export type redirectType = (
  urlPattern: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

export type routeDataType = {
  routePath: $ReadOnlyArray<string>,
  chunkName: string,
  filePath: string,
};

export default (
  folderPath: string,
  redirect: redirectType,
): $ReadOnlyArray<routeDataType> =>
  d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .reduce(
      (
        result: $ReadOnlyArray<routeDataType>,
        { data: { name, path: filePath } }: d3DirTreeNodeType,
      ): $ReadOnlyArray<routeDataType> => {
        const relativePath = path
          .relative(folderPath, filePath)
          .replace(/\.jsx?$/, '');

        if (/^\.templates/.test(relativePath))
          switch (relativePath.replace(/^\.templates\//, '')) {
            case 'Document':
              templates.getDocument = () => require(filePath);
              return result;

            default:
              return result;
          }

        return [
          ...result,
          {
            routePath: redirect([
              relativePath.replace(/(\/?index)?$/, '').replace(/^/, '/'),
            ]),
            chunkName: `pages/${relativePath}`,
            filePath,
          },
        ];
      },
      [],
    );
