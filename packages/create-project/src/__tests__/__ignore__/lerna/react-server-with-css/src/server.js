/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';
import React from '@mikojs/koa-react';
import useCss from '@mikojs/use-css';

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
}: contextType): Promise<http$Server> => {
  const react = new React(path.resolve(dir, './pages'), { dev } |> useCss);

  return (
    server.init()
    |> server.use(base)
    |> server.use(await react.middleware())
    |> server.run(port)
    |> (dev && watch
      ? server.watch(dir, [react.update])
      : emptyFunction.thatReturnsArgument)
  );
};
