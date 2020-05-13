#! /usr/bin/env node
// @flow

import path from 'path';

import ora from 'ora';

import { createLogger } from '@mikojs/utils';

import buildApi from '../index';
import buildCli from '../buildCli';

buildCli(
  process.argv,
  path.resolve('./api'),
  createLogger('@mikojs/server', ora({ discardStdin: false })),
  buildApi,
);
