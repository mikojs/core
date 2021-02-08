#! /usr/bin/env node
// @flow

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

handleUnhandledRejection();

const parseArgv = commander<
  | [
      {|
        help: () => void,
      |},
    ]
  | ['link-bin', {| remove?: boolean |}]
  | ['link-flow', {| remove?: boolean |}]
  | ['version', string],
>({
  name: 'lerna-helper',
  version,
  description: chalk`Some helpful commands for {green lerna}.`,
  commands: {
    'link-bin': {
      description: chalk`Link {green bin files} in the each package.`,
      options: [
        {
          flags: '--remove',
          description: chalk`Remove linked files in the each pacakge`,
        },
      ],
    },
    'link-flow': {
      description: chalk`Link {green .flowconfig} and {green packages} in the each package.`,
      options: [
        {
          flags: '--remove',
          description: chalk`Remove linked files in the each pacakge`,
        },
      ],
    },
    version: {
      description: chalk`Generate {green CHANGELOG.md} with {green lerna version}.`,
      args: '<version>',
    },
  },
});

(async () => {
  await parseArgv(process.argv);
})();
