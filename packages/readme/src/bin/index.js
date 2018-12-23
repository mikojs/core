#! /usr/bin/env node
// @flow

import readPkgUp from 'read-pkg-up';

import { handleUnhandledRejection } from '@cat-org/utils';

handleUnhandledRejection();

(async (): Promise<void> => {
  await readPkgUp();
})();
