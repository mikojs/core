#! /usr/bin/env node

import chalk from 'chalk';

import commander from '@mikojs/commander';

import { version } from '../../package.json';

commander({
  name: '@mikojs/lerna-run',
  version,
  description: chalk`Here are some useful commands for {green monorepo}.`,
  commands: {
    'link-flow': {
      description: chalk`Link {green .flowconfig}, {green dependencies} and {green devDependencies} in each package.`,
      options: [
        {
          flags: '--remove',
          description: 'Remove linked files in each package.',
        },
      ],
    },
  },
}).parse();
