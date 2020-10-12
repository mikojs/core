// @flow

import mergeDir from '../index';
import testings from './__ignore__/testings';

import watcher from 'utils/watcher';

mergeDir.updateTools({ type: 'build', watcher });

describe('merge dir', testings);
