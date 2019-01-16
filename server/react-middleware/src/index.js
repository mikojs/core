// @flow

import fs from 'fs';
import path from 'path';

import {
  type Middleware as koaMiddlewareType,
  type Context as koaContextType,
} from 'koa';
import Router from 'koa-router';
import compose from 'koa-compose';
import webpack from 'koa-webpack';
import { emptyFunction } from 'fbjs';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import getConfig, { type entryType } from './utils/getConfig';

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

  const router = new Router();
  const entry: entryType = {};

  d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .forEach(({ data: { path: filePath } }: d3DirTreeNodeType) => {
      const relativePath = path
        .relative(folderPath, filePath)
        .replace(/\.jsx?$/, '');

      entry[relativePath.replace(/\//g, '-')] = [filePath];

      redirect([
        relativePath.replace(/(index)?$/, '').replace(/^/, '/'),
      ]).forEach((routerPath: string) => {
        router.get(
          routerPath,
          async (ctx: koaContextType, next: () => Promise<void>) => {
            const Component = require(filePath);

            ctx.type = 'text/html; charset=utf-8';
            ctx.body = renderToNodeStream(<Component />);
            await next();
          },
        );
      });
    });

  return compose([
    router.routes(),
    router.allowedMethods(),
    dev
      ? await webpack({
          config: configFunc(getConfig(dev, entry)),
        })
      : async (ctx: koaContextType, next: () => Promise<void>) => {
          await next();
        },
  ]);
};
