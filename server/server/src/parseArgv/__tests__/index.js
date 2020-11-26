// @flow

import http from 'http';
import path from 'path';

import { emptyFunction } from 'fbjs';
import fetch, { type Response as ResponseType } from 'node-fetch';

import { type eventType } from '../../index';
import middleware from '../../__tests__/__ignore__/middleware';

import parseArgv, { type defaultOptionsType } from '../index';

describe('parse argv', () => {
  describe.each`
    sourcePath
    ${__dirname}
    ${path.resolve(__dirname, '../../__tests__/__ignore__/middleware.js')}
  `(
    'run command with source-path = $sourcePath',
    ({ sourcePath }: {| sourcePath: string |}) => {
      test.each`
        event
        ${'build'}
        ${'start'}
      `(
        'run commands with event = $event',
        async ({ event }: {| event: eventType |}) => {
          const server = await parseArgv(
            'server',
            (defaultOptions: defaultOptionsType) => ({
              ...defaultOptions,
              version: '1.0.0',
            }),
            sourcePath === __dirname
              ? emptyFunction.thatReturns(middleware)
              : emptyFunction,
            ['node', 'server', event, sourcePath],
          );

          if (server instanceof Array) throw new Error('Should be a server');

          if (event === 'build') expect(server).toBeNull();
          else
            expect(
              await fetch('http://localhost:3000').then((res: ResponseType) =>
                res.text(),
              ),
            ).toBe('test');

          if (server) server.close();
        },
      );
    },
  );

  test('custom commnad', async () => {
    const result = await parseArgv(
      'server',
      (defaultOptions: defaultOptionsType) => ({
        ...defaultOptions,
        version: '1.0.0',
        commands: {
          command: {
            description: 'description',
          },
        },
      }),
      emptyFunction,
      ['node', 'server', 'command'],
    );

    if (!result || result instanceof http.Server) expect(result).toBeTruthy();
    else expect(result.slice(0, -1)).toEqual(['command']);
  });

  test.each`
    command                 | expected
    ${[]}                   | ${'empty command'}
    ${['start', __dirname]} | ${'error'}
  `(
    'Run $command',
    async ({
      command,
      expected,
    }: {|
      command: $ReadOnlyArray<string>,
      expected: string,
    |}) => {
      await expect(
        parseArgv(
          'server',
          (defaultOptions: defaultOptionsType) => ({
            ...defaultOptions,
            version: '1.0.0',
          }),
          () => {
            throw new Error('error');
          },
          ['node', 'server', ...command],
        ),
      ).rejects.toThrow(expected);
    },
  );
});
