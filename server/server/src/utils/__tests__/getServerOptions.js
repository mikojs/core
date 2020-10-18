// @flow

import { type eventType } from '@mikojs/merge-dir/lib/utils/watcher';

import getServerOptions from '../getServerOptions';

describe('get server options', () => {
  test.each`
    argv       | expected
    ${[]}      | ${'error'}
    ${['dev']} | ${'dev'}
  `(
    'run $argv',
    async ({
      argv,
      expected,
    }: {|
      argv: $ReadOnlyArray<string>,
      expected: eventType | 'error',
    |}) => {
      expect(await getServerOptions(['node', 'server', ...argv])).toBe(
        expected,
      );
    },
  );
});
