// @flow

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - the context of the server
 *
 * @return {object} - http server
 */
export default ({ dir, dev, watch, port, restart }: contextType) =>
  server.init()
  |> server.use(base)
  |> server.run(port)
  |> (dev && watch
    ? server.watch(dir, [restart])
    : emptyFunction.thatReturnsArgument);
