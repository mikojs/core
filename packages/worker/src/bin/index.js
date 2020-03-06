#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@mikojs/utils';

import buildServer from 'utils/buildServer';

handleUnhandledRejection();
buildServer(parseInt(process.argv[2], 10));
