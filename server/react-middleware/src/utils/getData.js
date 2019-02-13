// @flow

import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

export type redirectType = (
  urlPattern: $ReadOnlyArray<string>,
) => $ReadOnlyArray<string>;

export type routeDataType = {|
  routePath: $ReadOnlyArray<string>,
  chunkName: string,
  filePath: string,
|};

export type dataType = {|
  templates: {|
    document: string,
    main: string,
    error: string,
  |},
  routesData: $ReadOnlyArray<routeDataType>,
|};

export default (
  folderPath: string,
  redirect: redirectType,
  basename: ?string,
): dataType => {
  const notFound = {
    routePath: [`${basename || ''}/*`],
    chunkName: `pages${basename || ''}/notFound`,
    filePath: path.resolve(__dirname, '../templates/NotFound.js'),
  };

  return d3DirTree(folderPath, {
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
            case 'Main':
            case 'Error':
              result.templates[
                relativePath.replace(/^\.templates\//, '').toLowerCase()
              ] = filePath;
              return result;

            case 'NotFound':
              return {
                ...result,
                routesData: [
                  ...result.routesData.filter(
                    ({ chunkName }: routeDataType) =>
                      chunkName !== notFound.chunkName,
                  ),
                  {
                    ...notFound,
                    filePath,
                  },
                ],
              };

            default:
              return result;
          }

        const routePath = redirect([
          relativePath.replace(/(\/?index)?$/, '').replace(/^/, '/'),
        ]);

        return {
          ...result,
          routesData: [
            {
              routePath: !basename
                ? routePath
                : routePath.map((prevPath: string) => `${basename}${prevPath}`),
              chunkName: `pages${basename || ''}/${relativePath}`,
              filePath,
            },
            ...result.routesData,
          ],
        };
      },
      {
        templates: {
          document: path.resolve(__dirname, '../templates/Document.js'),
          main: path.resolve(__dirname, '../templates/Main.js'),
          error: path.resolve(__dirname, '../templates/Error.js'),
        },
        routesData: [notFound],
      },
    );
};
