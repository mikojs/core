// @flow

import getServerOptions, { type serverOptionsType } from '../getServerOptions';

describe('get server options', () => {
  test.each`
    argv       | event
    ${[]}      | ${'error'}
    ${['dev']} | ${'dev'}
  `(
    'run $argv',
    async ({
      argv,
      event,
    }: {|
      argv: $ReadOnlyArray<string>,
      event: $PropertyType<serverOptionsType, 'event'>,
    |}) => {
      expect(await getServerOptions(['node', 'server', ...argv])).toEqual({
        event,
        filePath: process.cwd(),
        port: 3000,
      });
    },
  );
});
