// @flow

import readline from 'readline';

export default () => {
  const { log } = console;

  log(
    '\n'.repeat(
      /**
       * https://github.com/facebook/flow/issues/4487
       *
       * $FlowFixMe
       */
      process.stdout.rows,
    ),
  );
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};
