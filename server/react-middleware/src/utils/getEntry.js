// @flow

import fs from 'fs';
import path from 'path';

import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';

import { type routeDataType } from './getRoutesData';

const cacheDir = findCacheDir({ name: 'react-middleware', thunk: true });

/**
 * @example
 * getTemplate('template name')
 *
 * @param {string} templateName - template name
 *
 * @return {string} - template
 */
const getTemplate = (templateName: string) =>
  fs
    .readFileSync(
      path.resolve(__dirname, '../templates', templateName),
      'utf-8',
    )
    .replace(
      new RegExp(path.resolve(__dirname, '../../src/templates'), 'g'),
      cacheDir(),
    );

export default (
  folderPath: string,
  routesData: $ReadOnlyArray<routeDataType>,
): {
  string: $ReadOnlyArray<string>,
} => {
  const client = cacheDir('client.js');
  const root = cacheDir('Root.js');

  outputFileSync(client, getTemplate('client.js'));

  outputFileSync(
    root,
    getTemplate('Root.js').replace(
      /\/\*\* replace routesData \*\//,
      `[${routesData
        .map(
          ({ routePath, filePath }: routeDataType): string => {
            const relativePath = path.relative(folderPath, filePath);
            // TODO: add default loading
            const component = [
              `loader: () => import(/* webpackChunkName: "pages/${relativePath.replace(
                /\.jsx?$/,
                '',
              )}" */ '${filePath}')`,
              `webpack: () => [ require.resolveWeak('${filePath}') ]`,
              `modules: [ '${filePath}' ]`,
              "loading: () => 'loading'",
            ];

            return `{ routePath: ${JSON.stringify(
              routePath,
            )}, component: require('react-loadable')({ ${component.join(
              ', ',
            )} }) }`;
          },
        )
        .join(', ')}] ||`,
    ),
  );

  return {
    client: [client, root],
  };
};
