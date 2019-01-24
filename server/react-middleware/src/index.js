// @flow

import fs from 'fs';
import path from 'path';

import {
  type Middleware as koaMiddlewareType,
  type Context as koaContextType,
} from 'koa';
import compose from 'koa-compose';
import webpack from 'koa-webpack';
import { emptyFunction } from 'fbjs';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter as Router, Route } from 'react-router-dom';

import { handleUnhandledRejection } from '@cat-org/utils';

import getRoutesData, {
  type redirectType,
  type routeDataType,
} from './utils/getRoutesData';
import getConfig from './utils/getConfig';
import { getRoutes } from './utils/Root';

handleUnhandledRejection();

export default async ({
  folderPath = path.resolve('./src/pages'),
  redirect = emptyFunction.thatReturnsArgument,
  dev = true,
  config: configFunc = emptyFunction.thatReturnsArgument,
}: {
  folderPath?: string,
  redirect?: redirectType,
  dev?: boolean,
  config?: (cnofig: {}) => {},
} = {}): Promise<koaMiddlewareType> => {
  if (!fs.existsSync(folderPath))
    throw new Error(
      `\`${path.relative(
        process.cwd(),
        folderPath,
      )}\` folder can not be found.`,
    );

  const routesData = getRoutesData(folderPath, redirect);

  return compose([
    dev
      ? await webpack(
          configFunc({
            config: getConfig(dev, folderPath, routesData),
            devMiddleware: {
              stats: {
                maxModules: 0,
                colors: true,
              },
            },
            hotClient: {
              logLevel: 'warn',
            },
          }),
        )
      : async (ctx: koaContextType, next: () => Promise<void>) => {
          await next();
        },
    async (ctx: koaContextType, next: () => Promise<void>) => {
      ctx.type = 'text/html; charset=utf-8';
      // TODO: render not found
      ctx.body = renderToNodeStream(
        <>
          <main id="__cat__">
            <Router location={ctx.req.url} context={{}}>
              {getRoutes(
                routesData.map(
                  ({ routePath, chunkName, filePath }: routeDataType) => ({
                    routePath,
                    chunkName,
                    component: require(filePath),
                  }),
                ),
              )}
            </Router>
          </main>
          <script async src="/assets/commons.js" />
          <Router location={ctx.req.url} context={{}}>
            {routesData.map(({ routePath, chunkName }: routeDataType) => (
              <Route
                key={chunkName}
                path={routePath}
                component={() => (
                  <script async src={`/assets/${chunkName}.js`} />
                )}
                exact
              />
            ))}
          </Router>
          <script async src="/assets/client.js" />
        </>,
      );

      await next();
    },
  ]);
};
