#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@mikojs/utils';

import getOptions from 'utils/getOptions';

handleUnhandledRejection();

(async () => {
  const { type } = await getOptions(process.argv);

  switch (type) {
    case 'end':
      break;

    case 'init':
      break;

    default:
      break;
  }
})();
