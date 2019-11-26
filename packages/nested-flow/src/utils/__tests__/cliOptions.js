// @flow

import cliOptions from '../cliOptions';

describe('cli options', () => {
  test.each`
    argv                         | type
    ${[]}                        | ${'flow'}
    ${['stop']}                  | ${'flow'}
    ${['flow-typed', 'isntall']} | ${'flow-typed'}
  `(
    'Run $argv',
    async ({
      argv,
      type,
    }: {|
      argv: $ReadOnlyArray<string>,
      type: string,
    |}) => {
      expect(await cliOptions(['node', 'nested-flow', ...argv])).toEqual([
        type,
        ...argv.filter((key: string) => key !== 'flow-typed'),
      ]);
    },
  );
});
