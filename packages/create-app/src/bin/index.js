#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@cat-org/utils';

import cliOptions from 'utils/cliOptions';
import validateProject from 'utils/validateProject';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { projectDir } = cliOptions(process.argv);

  await validateProject(projectDir);
})();
