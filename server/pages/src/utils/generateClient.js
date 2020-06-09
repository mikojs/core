// @flow

import crypto from 'crypto';

import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';
import debug from 'debug';

import { type routesType } from './buildRoutes';

const debugLog = debug('pages:generateClient');

/**
 * @param {routesType} routes - routes cache
 *
 * @return {string} - client path
 */
export default (routes: routesType): string => {
  const cacheDir = findCacheDir({
    name: crypto
      .createHmac('sha256', `@mikojs/pages ${new Date().toString()}`)
      .digest('hex')
      .slice(0, 8),
    thunk: true,
  });
  const clientPath = cacheDir('client.js');

  debugLog(clientPath);
  outputFileSync(
    clientPath,
    `import { setConfig } from 'react-hot-loader';

import handleUnhandledRejection from '@mikojs/utils/lib/handleUnhandledRejection';
import client from '@mikojs/react-ssr/lib/client';

import Main from '${routes.main}';
import Loading from '${routes.loading}';
import Error from '${routes.error}';

handleUnhandledRejection();
setConfig({
  errorReporter: Error,
});
client({
  Main,
  Loading,
  Error,
  routesData: [${routes
    .get()
    .map(
      ({
        path,
        component: { chunkName },
      }: $ElementType<$PropertyType<routesType, 'routes'>, number>) =>
        `{ ${[
          'exact: true',
          `path: '${path}'`,
          `component: { ${[
            `chunkName: '${chunkName}'`,
            `loader: () => import(/* webpackChunkName: "${chunkName}" */ '${routes.getFilePath(
              path,
            )}')`,
          ].join(',')} }`,
        ].join(',')} }`,
    )
    .join(',')}],
});`,
  );

  return clientPath;
};
