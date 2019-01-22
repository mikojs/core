// @flow

import fs from 'fs';
import path from 'path';

import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';

import { type routeDataType } from './getRoutesData';

const cacheDir = findCacheDir({ name: 'react-middleware', thunk: true });

export default (
  routesData: $ReadOnlyArray<routeDataType>,
): [string, string] => {
  const client = cacheDir('client.js');
  const root = cacheDir('Root.js');

  outputFileSync(
    client,
    fs.readFileSync(path.resolve(__dirname, '../templates/client.js'), 'utf-8'),
  );

  outputFileSync(
    root,
    fs
      .readFileSync(path.resolve(__dirname, '../templates/Root.js'), 'utf-8')
      .replace(
        /\/\*\* replace routesData \*\//,
        `[${routesData
          .map(
            ({ routePath, filePath }: routeDataType) =>
              `{ routePath: '${routePath}', component: require('${filePath}') }`,
          )
          .join(', ')}] ||`,
      ),
  );

  return [client, root];
};
