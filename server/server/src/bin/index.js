#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@mikojs/utils';

import server from '../index';

import getServerOptions from 'utils/getServerOptions';

handleUnhandledRejection();

(async () => {
  const type = await getServerOptions(process.argv);

  if (type === 'error') process.exit(1);
  else server.set(type);
})();
