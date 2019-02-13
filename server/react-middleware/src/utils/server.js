// @flow

import { type Context as koaContextType } from 'koa';
import React, { type ComponentType } from 'react';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import multistream from 'multistream';

import { type ctxType } from '../types';
import Core from '../Core';

import { type dataType, type routeDataType } from 'utils/getData';

export default (
  basename: ?string,
  { routesData, templates }: dataType,
) => {
  const serverRoutesData = routesData.map(({ routePath, chunkName, filePath }: routeDataType) => ({
    exact: true,
    path: routePath,
    component: {
      loader: () => require(filePath),
      moduleId: chunkName,
    },
  }));

  return async (ctx: koaContextType, next: () => Promise<void>) => {
    const commonsUrl = `/assets${basename || ''}/commons.js`;

    if (commonsUrl === ctx.path) {
      ctx.status = 200;
      ctx.type = 'application/javascript';
      ctx.body = '';
      return;
    }

    // TODO: just for html

    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.respond = false;

    multistream([
      renderToNodeStream(
        <Router location={ctx.url} context={{}}>
          <Core
            Main={require(templates.main)}
            Error={require(templates.error)}
            routesData={serverRoutesData}
          />
        </Router>,
      ),
    ]).pipe(ctx.res);
  };
};
