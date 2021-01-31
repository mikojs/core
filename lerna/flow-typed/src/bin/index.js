#! /usr/bin/env node
// @flow

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

import link from 'utils/link';

handleUnhandledRejection();

const parseArgv = commander<
  | [
      {|
        help: () => void,
      |},
    ]
  | ['link', {| remove?: boolean |}],
>({
  name: 'lerna-flow-typed',
  version,
  description: chalk`Handle the all {green flow-typed} folders in the monorepo.`,
  commands: {
    link: {
      description: chalk`Link {green .flowconfig} in the each package.`,
      options: [
        {
          flags: '--remove',
          description: chalk`Remove linked {green .flowconfig} in the each pacakge`,
        },
      ],
    },
  },
});

(async () => {
  const result = await parseArgv(process.argv);

  if (result.length === 2) {
    await link(Boolean(result[1].remove));
    return;
  }

  result[0].help();
})();
