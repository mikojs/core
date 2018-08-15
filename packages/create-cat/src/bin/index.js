#! /usr/bin/env node
// @flow

import commander from 'commander';
import chalk from 'chalk';

import { name, version } from '../../package.json';

const program = new commander.Command(name)
  .version(version, '-v, --version')
  .arguments('<project-directory>')
  .usage(chalk`{green <project-directory>} {gray [options]}`);

program.parse(process.argv);
