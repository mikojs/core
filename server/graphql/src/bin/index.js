// @flow

import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import graphql from '../index';
import { version } from '../../package.json';

parseArgv(
  'graphql',
  (defaultOptions: defaultOptionsType) => ({
    ...defaultOptions,
    version,
  }),
  graphql,
  process.argv,
).catch(() => {
  process.exit(1);
});
