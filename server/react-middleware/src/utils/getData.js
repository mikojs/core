// @flow

import path from 'path';

import { type ElementType } from 'react';
import { emptyFunction } from 'fbjs';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import Document from 'templates/Document';

export type redirectType = (
  urlPattern: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

export type routeDataType = {|
  routePath: $ReadOnlyArray<string>,
  chunkName: string,
  filePath: string,
|};

export type templatesType = {|
  getDocument: () => ElementType,
|};

export type dataType = {|
  templates: templatesType,
  routesData: $ReadOnlyArray<routeDataType>,
|};

export default (
  folderPath: string,
  redirect: redirectType,
  basename: ?string,
): dataType =>
  d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .reduce(
      (
        result: dataType,
        { data: { name, path: filePath } }: d3DirTreeNodeType,
      ): dataType => {
        const relativePath = path
          .relative(folderPath, filePath)
          .replace(/\.jsx?$/, '');

        if (/^\.templates/.test(relativePath))
          switch (relativePath.replace(/^\.templates\//, '')) {
            case 'Document':
              result.templates.getDocument = () => require(filePath);
              return result;

            default:
              return result;
          }

        const routePath = redirect([
          relativePath.replace(/(\/?index)?$/, '').replace(/^/, '/'),
        ]);

        return {
          ...result,
          routesData: [
            ...result.routesData,
            {
              routePath: !basename
                ? routePath
                : routePath.map((prevPath: string) => `${basename}${prevPath}`),
              chunkName: `pages${basename || ''}/${relativePath}`,
              filePath,
            },
          ],
        };
      },
      {
        templates: {
          getDocument: emptyFunction.thatReturns(Document),
        },
        routesData: [],
      },
    );
