#! /usr/bin/env node
// @flow

// TODO import execa from 'execa';
import chalk from 'chalk';

import logger, { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './core/cliOptions';

import analyticsRepo from 'utils/analyticsRepo';

handleUnhandledRejection();

const log = logger(chalk`helper {bold {gray [dev]}}`);

log.info(chalk`Root folder: ${cliOptions.root}`);
analyticsRepo(cliOptions.root);
