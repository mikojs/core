// @flow

import { emptyFunction } from 'fbjs';
import bodyparser from 'koa-bodyparser';
import compress from 'koa-compress';
import etag from 'koa-etag';
import helmet from 'koa-helmet';
import morgan from 'koa-morgan';

import { mockChoice } from '@cat-org/utils';

import createLogs from 'utils/createLogs';

export default [
  morgan(
    ...mockChoice(
      process.env.NODE_ENV === 'production',
      createLogs,
      emptyFunction.thatReturns(['dev']),
    ),
  ),
  helmet(),
  etag(),
  bodyparser(),
  compress(),
];
