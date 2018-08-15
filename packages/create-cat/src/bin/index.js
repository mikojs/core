#! /usr/bin/env node
// @flow

import commander from 'commander';
import chalk from 'chalk';

import getSettings from 'utils/getSettings';

import { name, version } from '../../package.json';

import config from '../config';

let projectDir = null;

const program = new commander.Command(name)
  .version(version, '-v, --version')
  .arguments('<project-directory>')
  .usage(chalk`{green <project-directory>} {gray [options]}`)
  .action(arguProjectDir => {
    projectDir = arguProjectDir;
  });

// TODO
program.parse(process.argv);

getSettings(config).forEach(node => {
  console.log(node);
});
