#! /usr/bin/env node
// @flow

import ora from 'ora';

import { createLogger } from '@mikojs/utils';

import buildApi from '../index';
import buildCli from '../buildCli';

buildCli(
  process.argv,
  createLogger('@mikojs/server', ora({ discardStdin: false })),
  buildApi,
);
