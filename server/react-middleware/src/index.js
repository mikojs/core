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
import { StaticRouter as Router, Switch, Route } from 'react-router-dom';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import getConfig from './utils/getConfig';

export default async ({
  folderPath = path.resolve('./src/pages'),
  redirect = emptyFunction.thatReturnsArgument,
  dev = true,
  config: configFunc = emptyFunction.thatReturnsArgument,
}: {
  folderPath?: string,
  redirect?: (urlPattern: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
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

  const routes = [];

  d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .forEach(({ data: { name, path: filePath } }: d3DirTreeNodeType) => {
      const relativePath = path
        .relative(folderPath, filePath)
        .replace(/\.jsx?$/, '');

      redirect([
        relativePath.replace(/(index)?$/, '').replace(/^/, '/'),
      ]).forEach((routePath: string) => {
        routes.push(
          <Route
            key={routePath}
            path={routePath}
            component={require(filePath)}
            exact
          />,
        );
      });
    });

  return compose([
    dev
      ? await webpack(
          configFunc({
            config: getConfig(dev),
            devMiddleware: { logLevel: 'warn' },
            hotClient: { logLevel: 'warn' },
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
          <Router location={ctx.req.url} context={{}}>
            <Switch>{routes}</Switch>
          </Router>

          <script async src="/assets/client.js" />
        </>,
      );

      await next();
    },
  ]);
};
