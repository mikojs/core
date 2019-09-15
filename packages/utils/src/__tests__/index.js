// @flow

import throwMessageInIndex from '../throwMessageInIndex';

/**
 * FIXME:
 * Owing to jest coverage, can not remove index
 * Remove it after upgrading jest
 */
throwMessageInIndex.test('@mikojs/utils', () => require('../index'));
