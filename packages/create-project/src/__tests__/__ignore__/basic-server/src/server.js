/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

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
export default async ({
  dir,
  dev,
  watch,
  port,
  restart,
}: contextType): Promise<http$Server> =>
  server.init()
  |> server.use(base)
  |> server.run(port)
  |> (dev && watch
    ? server.watch(dir, [restart])
    : emptyFunction.thatReturnsArgument);
