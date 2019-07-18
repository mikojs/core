// @flow

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';

import defaults from '../index';

let runningServer: http$Server;

jest.mock('../../utils/loadModule', () => <A, B>(a: A, b: B): B => b);

describe.each`
  dev          | watch
  ${undefined} | ${undefined}
  ${true}      | ${true}
`(
  'default server with dev = $dev, watch = $watch',
  ({ dev, watch }: {| dev: boolean, watch: boolean |}) => {
    beforeEach(async () => {
      runningServer = await defaults({
        src: path.resolve(__dirname, './__ignore__/src'),
        dir: path.resolve(__dirname, './__ignore__/src'),
        dev,
        watch,
      });
    });

    test('test', async () => {
      expect(
        await fetch('http://localhost:8000').then((res: ResponseType) =>
          res.text(),
        ),
      ).toBe('Not Found');
    });

    afterAll(() => {
      runningServer.close();
    });
  },
);
