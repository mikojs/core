#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@cat-org/utils';

import cliOptions from 'utils/cliOptions';
import lernaCreate from 'utils/lernaCreate';

handleUnhandledRejection();

(async (): Promise<void> => {
  await lernaCreate(await cliOptions(process.argv));
})();
