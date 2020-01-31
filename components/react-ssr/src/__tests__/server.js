/**
 * @jest-environment node
 *
 * @flow
 */

import React from 'react';
import type MultistreamType from 'multistream';

import server from '../server';

import testings, {
  Document,
  Main,
  Error,
  chunkName,
  routesData,
} from './__ignore__/testings';

test('server', async () => {
  expect(
    await server(
      { url: chunkName, path: chunkName },
      { Document, Main, Error, routesData },
      <script />,
      jest.fn(),
    ).then(
      (stream: MultistreamType) =>
        new Promise(resolve => {
          let output: string = '';

          stream.on('data', (chunk: string) => {
            output = `${output}${chunk}`;
          });
          stream.on('end', () => resolve(output));
        }),
    ),
  ).toBe(`<!DOCTYPE html><main id="__MIKOJS__">${testings}</main>`);
});
