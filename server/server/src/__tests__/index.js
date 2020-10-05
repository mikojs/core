// @flow

import server from '../index';
import testings from './__ignore__/testings';

import watcher from 'utils/watcher';

server.set({ watcher });

describe('server', testings);
