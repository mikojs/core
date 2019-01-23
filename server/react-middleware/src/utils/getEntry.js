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
          ({ routePath, filePath }: routeDataType) =>
            `{ routePath: '${routePath}', component: require('${filePath}') }`,
        )
        .join(', ')}] ||`,
    ),
  );

  return {
    client: [client, root],
  };
};
