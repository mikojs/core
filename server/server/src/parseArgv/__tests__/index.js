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

          if (event === 'build') expect(server).toBeNull();
          else {
            expect(server).toBeInstanceOf(http.Server);
            expect(
              await fetch('http://localhost:3000').then((res: ResponseType) =>
                res.text(),
              ),
            ).toBe('test');
          }

          if (server) server.close();
        },
      );
    },
  );

  test('parse argv error', async () => {
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
        ['node', 'server', 'start', __dirname],
      ),
    ).rejects.toThrow('error');
  });
});
