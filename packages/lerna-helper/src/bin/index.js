#! /usr/bin/env node
// @flow

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

import linkBin from 'utils/linkBin';
import linkFlow from 'utils/linkFlow';
import release from 'utils/release';

handleUnhandledRejection();

const parseArgv = commander<
  | [
      {|
        help: () => void,
      |},
    ]
  | ['link-bin', {| remove?: boolean |}]
  | ['link-flow', {| remove?: boolean |}]
  | ['release', string, {||}],
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
    release: {
      description: chalk`Generate {green CHANGELOG.md} with {green lerna version}.`,
      args: '<version>',
    },
  },
});

(async () => {
  const result = await parseArgv(process.argv);

  if (result.length === 3) {
    await release(result[1]);
    return;
  }

  if (result.length === 2) {
    if (result[0] === 'link-flow') await linkFlow(Boolean(result[1].remove));
    else await linkBin(Boolean(result[1].remove));
    return;
  }

  result[0].help();
})();
