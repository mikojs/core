// @flow

import http from 'http';

import { emptyFunction } from 'fbjs';
import fetch, { type Response as ResponseType } from 'node-fetch';

import { createLogger } from '@mikojs/utils';

import { type eventType } from '../index';
import parseArgv, { buildLog, handleErrorMessage } from '../parseArgv';

import middleware from './__ignore__/middleware';

describe('parse argv', () => {
  test.each`
    data
    ${'done'}
    ${true}
    ${false}
  `('run with data = $data', ({ data }: {| data: 'done' | boolean |}) => {
    const mockLog = jest.fn();

    global.console = {
      log: mockLog,
      info: mockLog,
    };
    buildLog(
      'server',
      createLogger('server'),
    )(data === 'done' ? data : { exists: data, filePath: './', pathname: '/' });

    expect(mockLog).toHaveBeenCalled();
  });

  test('could not find a build error', () => {
    expect(
      handleErrorMessage('server', new Error('Cannot find module main.js')),
    ).toMatch(/Could not find a valid build./);
  });

  test.each`
    event
    ${'build'}
    ${'start'}
  `(
    'run commands with event = $event',
    async ({ event }: {| event: eventType |}) => {
      const server = await parseArgv(
        'server',
        '1.0.0',
        emptyFunction.thatReturns(middleware),
        ['node', 'server', event, __dirname],
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

  test('parse argv error', async () => {
    await expect(
      parseArgv(
        'server',
        '1.0.0',
        () => {
          throw new Error('error');
        },
        ['node', 'server', 'start', __dirname],
      ),
    ).rejects.toThrow('error');
  });
});
