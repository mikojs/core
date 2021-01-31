// @flow

import http from 'http';
import path from 'path';

import { emptyFunction } from 'fbjs';
import fetch, { type Response as ResponseType } from 'node-fetch';

import testingLogger from '@mikojs/logger/lib/testingLogger';

import { type eventType } from '../../index';
import middleware from '../../__tests__/__ignore__/middleware';

import parseArgv, { type defaultOptionsType } from '../index';

describe('parse argv', () => {
  beforeEach(() => {
    testingLogger.reset();
  });

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

          if (server instanceof Array)
            throw new Error('Could not find the server.');

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
    ${[]}                   | ${'Commands could not be empty.'}
    ${['start', __dirname]} | ${'Run server fail.'}
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
            throw new Error(expected);
          },
          ['node', 'server', ...command],
        ),
      ).rejects.toThrow(expected);
    },
  );
});
