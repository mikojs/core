#! /usr/bin/env node
// @flow

import dirCommand from '@babel/cli/lib/babel/dir';
import debug from 'debug';

import { handleUnhandledRejection } from '@mikojs/utils';

handleUnhandledRejection();

const opts = JSON.parse(process.argv[2]);

debug('server:bin:runBabel')(opts);
dirCommand(opts);
