// @flow

import { emptyFunction } from 'fbjs';
import compose from 'koa-compose';
import bodyparser from 'koa-bodyparser';
import compress from 'koa-compress';
import etag from 'koa-etag';
import helmet from 'koa-helmet';
import morgan from 'koa-morgan';

import { mockChoice } from '@cat-org/utils';

import createLogs from './utils/createLogs';

export default compose([
  morgan(
    ...mockChoice(
      process.env.NODE_ENV === 'production',
      createLogs,
      emptyFunction.thatReturns([
        'dev',
        {
          skip: emptyFunction.thatReturns(process.env.NODE_ENV === 'test'),
        },
      ]),
    ),
  ),
  helmet(),
  etag(),
  bodyparser(),
  compress(),
]);
