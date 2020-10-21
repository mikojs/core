// @flow

import parseArgv from '@mikojs/server/lib/parseArgv';

import router from '../index';

import { version } from '../../package.json';

parseArgv('router', version, router, process.argv);
