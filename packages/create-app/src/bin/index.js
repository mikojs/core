#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@cat-org/utils';

import cliOptions from 'utils/cliOptions';
import validateProject from 'utils/validateProject';
import base from 'stores/base';

import type StoreType from 'stores';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { projectDir } = cliOptions(process.argv);

  await validateProject(projectDir);

  const storeNames = [];

  (await base.run({ projectDir }))
    .filter(
      ({ constructor: { name } }: StoreType): boolean => {
        if (storeNames.includes(name)) return false;

        storeNames.push(name);
        return true;
      },
    )
    .forEach((store: StoreType) => {
      store.end();
    });
})();
