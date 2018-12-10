#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@cat-org/utils';

import cliOptions from 'utils/cliOptions';

handleUnhandledRejection();

(async (): Promise<void> => {
  cliOptions(process.argv);
})();
