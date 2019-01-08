// @flow

import fs from 'fs';
import path from 'path';

import type koaType, { Context as koaContextType } from 'koa';
import Router from 'koa-router';
import { emptyFunction } from 'fbjs';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

export default (
  app: koaType,
  {
    folderPath = path.resolve('./src/pages'),
    redirect = emptyFunction.thatReturnsNull,
  }: {
    folderPath?: string,
    redirect?: (urlPattern: string) => ?string,
  } = {},
) => {
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
            async (
              ctx: koaContextType,
              next: () => Promise<void>,
            ): Promise<void> => {
              const Component = require(filePath);

              renderToNodeStream(<Component ctx={ctx} />).pipe(ctx.res);
              ctx.status = 200;
            },
          );
          break;
      }
    });

  app.use(router.routes());
  app.use(router.allowedMethods());
};
