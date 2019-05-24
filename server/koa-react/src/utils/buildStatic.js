// @flow

import path from 'path';

import fetch from 'node-fetch';
import outputFileSync from 'output-file-sync';

import { type dataType } from './getData';

const routePaths = [];

/**
 * @example
 * buildStatic(server)
 *
 * @param {Koa} server - koa server
 * @param {Object} options - build static options
 */
export const buildStatic = async (
  server: http$Server,
  {
    port = 8000,
    folderPath = path.resolve('./docs'),
    buildHtml = false,
  }: {|
    port?: number,
    folderPath?: string,
    buildHtml?: boolean,
  |} = {},
) => {
  if (routePaths.length === 0) return;

  if (buildHtml)
    await Promise.all(
      routePaths.map(async (routePath: string) => {
        outputFileSync(
          path.resolve(
            folderPath,
            `.${routePath.replace(/\*$/, 'notFound')}`,
            /\.js$/.test(routePath) ? '' : './index.html',
          ),
          await fetch(`http://localhost:${port}${routePath}`).then(
            (res: {| text: () => string |}) => res.text(),
          ),
        );
      }),
    );

  server.close();
};

export default ({ routesData }: dataType, commonsUrl: string) => {
  routesData.forEach(
    ({
      routePath,
    }: $ElementType<$PropertyType<dataType, 'routesData'>, number>) => {
      routePaths.push(...routePath);
    },
  );

  routePaths.push(commonsUrl);
};
