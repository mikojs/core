// @flow

import { ExecutionEnvironment } from 'fbjs';

import node from './node';
import browser from './browser';

export default (!ExecutionEnvironment.canUseEventListeners ? node : browser);
