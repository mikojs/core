#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@mikojs/utils';

import server from '../index';

import getOptions from 'utils/getOptions';

handleUnhandledRejection();

(async () => {
  const type = await getOptions(process.argv);

  if (type === 'error') process.exit(1);
  else server.set(type);
})();
