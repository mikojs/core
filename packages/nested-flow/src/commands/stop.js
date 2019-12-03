// @flow

import execa from 'execa';

/**
 * @example
 * command(['flow', 'stop'], '/folder')
 *
 * @param {Array} argv - argv array
 * @param {string} cwd - the folder where command runs
 */
export default async (argv: $ReadOnlyArray<string>, cwd: string) => {
  const { log } = console;

  await execa(argv[0], argv.slice(1), {
    cwd,
    stdio: 'inherit',
  });
  log();
};
