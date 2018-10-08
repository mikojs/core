#! /usr/bin/env node
// @flow

// TODO import execa from 'execa';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@cat-org/logger';

import cliOptions from './core/cliOptions';

import logger from 'utils/logger';
import analyticsRepo from 'utils/analyticsRepo';

handleUnhandledRejection();

analyticsRepo(cliOptions.root);

logger.info(chalk`{bold {gray [dev]}} Root folder: ${cliOptions.root}`);
