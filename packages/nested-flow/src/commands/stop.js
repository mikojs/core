// @flow

import { type commandType } from '../types';

/**
 * @example
 * stop()
 *
 * @return {commandType} - stop command object
 */
export default (): commandType => ({
  options: {
    stdio: 'inherit',
  },
});
