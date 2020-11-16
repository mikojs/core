#! /usr/bin/env node
// @flow

import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import router from '../index';
import { version } from '../../package.json';

parseArgv(
  'router',
  (defaultOptions: defaultOptionsType) => ({
    ...defaultOptions,
    version,
  }),
  router,
  process.argv,
).catch(() => {
  process.exit(1);
});
