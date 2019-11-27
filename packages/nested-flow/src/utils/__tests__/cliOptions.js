// @flow

import cliOptions from '../cliOptions';

describe('cli options', () => {
  test.each`
    argv                                          | expected
    ${[]}                                         | ${['flow']}
    ${['--show-all-errors']}                      | ${['flow', '--show-all-errors']}
    ${['status']}                                 | ${['flow', 'status']}
    ${['status', '--show-all-errors']}            | ${['flow', 'status', '--show-all-errors']}
    ${['flow-typed', 'install']}                  | ${['flow-typed', 'install']}
    ${['flow-typed', 'install', '-f', 'version']} | ${['flow-typed', 'install', '-f', 'version']}
  `(
    'Run $argv',
    async ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: $ReadOnlyArray<string>,
    |}) => {
      expect(await cliOptions(['node', 'nested-flow', ...argv])).toEqual({
        argv: expected,
        filteredArgv: expected.filter(
          (key: string) =>
            !['--show-all-errors', '-f', 'version'].includes(key),
        ),
      });
    },
  );
});
