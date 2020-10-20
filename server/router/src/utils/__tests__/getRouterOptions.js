// @flow

import path from 'path';

import getRouterOptions, { type routerOptionsType } from '../getRouterOptions';

const folderPath = path.resolve(__dirname, '..');

describe('get router options', () => {
  test.each`
    argv                   | event
    ${[]}                  | ${'error'}
    ${['dev', folderPath]} | ${'dev'}
  `(
    'run $argv',
    async ({
      argv,
      event,
    }: {|
      argv: $ReadOnlyArray<string>,
      event: $PropertyType<routerOptionsType, 'event'>,
    |}) => {
      expect(await getRouterOptions(['node', 'router', ...argv])).toEqual({
        event,
        folderPath,
        port: 3000,
      });
    },
  );
});
