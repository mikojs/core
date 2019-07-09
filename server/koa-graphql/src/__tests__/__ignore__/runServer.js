// @flow

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import Graphql, { type optionsType } from '../../index';

/**
 * @example
 * runServer(options)
 *
 * @param {optionsType} options - @cat-org/koa-graphql options
 *
 * @return {Promise<{ server: object, request: Function }>} - server and request function
 */
export default async (
  options?: optionsType,
): Promise<{
  server: http$Server,
  graphql: Graphql,
  request: (query: string) => Promise<{ data: {} }>,
}> => {
  const app = new Koa();
  const port = await getPort();
  const graphql = new Graphql(path.resolve(__dirname, './schema'), options);

  app.use(graphql.middleware());

  const server = app.listen(port);

  return {
    server,
    graphql,
    request: (query: string) =>
      fetch(`http://localhost:${port}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      }).then((res: ResponseType) => res.json()),
  };
};
