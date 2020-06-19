// @flow

import outputFileSync from 'output-file-sync';

import { type routesType } from '../index';

/**
 * @param {routesType} routes - routes cache
 * @param {string} clientPath - client path
 */
export default (routes: routesType, clientPath: string) => {
  outputFileSync(
    clientPath,
    `import { setConfig } from 'react-hot-loader';

import handleUnhandledRejection from '@mikojs/utils/lib/handleUnhandledRejection';
import client from '@mikojs/react-ssr/lib/client';

import Main from '${routes.getTamplate('main')}';
import Loading from '${routes.getTamplate('loading')}';
import Error from '${routes.getTamplate('error')}';

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
      }: $ElementType<$PropertyType<routesType, 'cache'>, number>) =>
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
};
