// @flow

import execa from 'execa';
import debug from 'debug';

const debugLog = debug('nested-flow:commands:stop');

/**
 * @example
 * command(['flow', 'stop'], '/folder')
 *
 * @param {Array} argv - argv array
 * @param {string} cwd - the folder where command runs
 *
 * @return {Function} - the end function
 */
export default async (
  argv: $ReadOnlyArray<string>,
  cwd: string,
): Promise<() => boolean> => {
  const { log } = console;
  let hasError: boolean = false;

  try {
    await execa(argv[0], argv.slice(1), {
      cwd,
      stdio: 'inherit',
    });
  } catch (e) {
    debugLog(e);
    hasError = true;
  }

  log();

  return () => hasError;
};
