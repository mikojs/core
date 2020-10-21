// @flow

import { handleUnhandledRejection } from '@mikojs/utils';
import parseArgv from '@mikojs/server/lib/parseArgv';

import router from '../index';

import { version } from '../../package.json';

handleUnhandledRejection();
parseArgv('router', version, router, process.argv);
