// @flow

import readline from 'readline';

export default () => {
  const { log } = console;

  /**
   * https://github.com/facebook/flow/issues/4487
   *
   * $FlowFixMe
   */
  log('\n'.repeat(process.stdout.rows));
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};
