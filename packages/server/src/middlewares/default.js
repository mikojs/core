// @flow

import fs from 'fs';
import path from 'path';

import { emptyFunction } from 'fbjs';
import bodyparser from 'koa-bodyparser';
import compress from 'koa-compress';
import etag from 'koa-etag';
import helmet from 'koa-helmet';
import morgan from 'koa-morgan';

import { mockChoice } from '@cat-org/utils';

export default [
  morgan(
    ...mockChoice(
      process.env.NODE_ENV === 'production',
      emptyFunction.thatReturns([
        'combined',
        {
          stream: fs.createWriteStream(
            path.resolve(`${new Date().getTime()}.log`),
            {
              flags: 'a',
            },
          ),
        },
      ]),
      emptyFunction.thatReturns(['dev']),
    ),
  ),
  helmet(),
  etag(),
  bodyparser(),
  compress(),
];
