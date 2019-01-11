// @flow

import fs from 'fs';
import path from 'path';

import {
  type Middleware as koaMiddlewareType,
  type Context as koaContextType,
} from 'koa';
import Router from 'koa-router';
import compose from 'koa-compose';
import { emptyFunction } from 'fbjs';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

export default ({
  folderPath = path.resolve('./src/pages'),
  redirect = emptyFunction.thatReturnsNull,
}: {
  folderPath?: string,
  redirect?: (urlPattern: string) => ?string,
} = {}): koaMiddlewareType => {
  if (!fs.existsSync(folderPath))
    throw new Error(
      `\`${path.relative(
        process.cwd(),
        folderPath,
      )}\` folder can not be found.`,
    );

  const router = new Router();

  d3DirTree(folderPath)
    .leaves()
    .forEach(({ data: { name, path: filePath } }: d3DirTreeNodeType) => {
      const urlPattern = path
        .relative(folderPath, filePath)
        .replace(/(index)?\.jsx?$/, '');

      switch (urlPattern) {
        default:
          router.get(
            redirect(urlPattern) || `/${urlPattern}`,
            async (ctx: koaContextType, next: () => Promise<void>) => {
              const Component = require(filePath);

              ctx.type = 'text/html; charset=utf-8';
              ctx.body = renderToNodeStream(<Component />);
              await next();
            },
          );
          break;
      }
    });

  return compose([router.routes(), router.allowedMethods()]);
};
