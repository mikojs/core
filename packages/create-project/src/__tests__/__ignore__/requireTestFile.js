// @flow

import { requireModule } from '@mikojs/utils';

/**
 * @example
 * requireTestFile('/filePath')
 *
 * @param {string} filePath - file path
 */
export default (filePath: string) => {
  requireModule(filePath.replace(/testFiles/, '__ignore__'));
};
