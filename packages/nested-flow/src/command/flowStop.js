// @flow

import { type commandType } from '../types';

/**
 * @example
 * flowStop()
 *
 * @return {commandType} - flow stop command object
 */
export default (): commandType => ({
  keys: [['flow', 'stop']],
  options: {
    stdio: 'inherit',
  },
});
