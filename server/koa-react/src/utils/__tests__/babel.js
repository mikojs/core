// @flow

import { transformSync } from '@babel/core';
import { emptyFunction } from 'fbjs';

import babel from '../babel';

test('babel', () => {
  expect(
    transformSync(
      `var _Main = _interopRequireDefault(require("../../templates/Main"));

var _Loading = _interopRequireDefault(require("../../templates/Loading"));

var _Error = _interopRequireDefault(require("../../templates/Error"));

var _routesData = _interopRequireDefault(require("../../templates/routesData"));`,
      {
        filename: __filename,
        plugins: [
          [
            babel,
            {
              cacheDir: emptyFunction.thatReturnsArgument,
            },
          ],
        ],
        babelrc: false,
      },
    ).code,
  ).toBeTruthy();
});
