// @flow

import path from 'path';

import { transformSync } from '@babel/core';
import { emptyFunction } from 'fbjs';

import babel from '../babel';

import testings from './__ignore__/testings';

describe('babel', () => {
  test.each(testings)(
    `%s`,
    (
      content: string,
      expected: string,
      cacheDir: (
        filename: string,
      ) => string = emptyFunction.thatReturnsArgument,
    ) => {
      expect(
        transformSync(content, {
          filename: path.resolve(__dirname, './__ignore__/testings.js'),
          plugins: [
            [
              babel,
              {
                cacheDir,
              },
            ],
          ],
          babelrc: false,
        }).code,
      ).toBe(expected);
    },
  );
});
