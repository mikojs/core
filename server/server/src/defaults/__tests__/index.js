// @flow

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';

import defaults from '../index';

jest.mock('../../utils/loadModule', () => <A, B>(a: A, b: B): B => b);

test.each`
  dev          | watch
  ${undefined} | ${undefined}
  ${true}      | ${true}
`(
  'default server with dev = $dev, watch = $watch',
  async ({ dev, watch }: {| dev: boolean, watch: boolean |}) => {
    const runningServer = await defaults({
      src: path.resolve(__dirname, './__ignore__/src'),
      dir: path.resolve(__dirname, './__ignore__/src'),
      dev,
      watch,
    });

    expect(
      await fetch('http://localhost:8000').then((res: ResponseType) =>
        res.text(),
      ),
    ).toBe('Not Found');

    runningServer.close();
  },
);
