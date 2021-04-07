#! /usr/bin/env node

import commander from '@mikojs/commander';

import { version } from '../../package.json';

commander({
  name: '@mikojs/miko',
  version,
  description: 'Use a simple config to manage commands.',
}).parse();
