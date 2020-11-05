// @flow

import parseArgv from '@mikojs/server/lib/parseArgv';

import graphql from '../index';
import { version } from '../../package.json';

parseArgv('graphql', version, graphql, process.argv).catch(() => {
  process.exit(1);
});
