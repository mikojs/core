// @flow

import replaceLoader from '../replaceLoader';

const ROUTERS = {
  routesData: 'routesData',
  main: 'main',
  loading: 'loading',
  error: 'error',
};
const SOURCE =
  '/** routesData */."templates/Main"."templates/Loading"."templates/Error"';

describe('replace loader', () => {
  test.each`
    type                  | routers      | source                            | expected
    ${'routers'}          | ${ROUTERS}   | ${SOURCE}                         | ${'routesData."main"."loading"."error"'}
    ${'set-config'}       | ${undefined} | ${'/** setConfig */'}             | ${"require('react-hot-loader').setConfig || "}
    ${'react-hot-loader'} | ${undefined} | ${'module.exports = module;'}     | ${"module.exports = require('react-hot-loader/root').hot(module);"}
    ${'react-hot-loader'} | ${undefined} | ${'exports["default"] = module;'} | ${'exports["default"] = require(\'react-hot-loader/root\').hot(module);'}
  `(
    'run with source = $source and type = $type',
    ({
      type,
      routers,
      source,
      expected,
    }: {
      type: string,
      routers?: { [string]: string },
      source: string,
      expected: string,
    }) => {
      expect(replaceLoader.bind({ query: { type, routers } })(source)).toBe(
        expected,
      );
    },
  );

  test('replace type error', () => {
    expect(() => {
      replaceLoader.bind({ query: '' })('test');
    }).toThrowError('Replace type error');
  });

  test('not replace anything', () => {
    expect(() => {
      replaceLoader.bind({ query: { type: 'react-hot-loader' } })('test');
    }).toThrowError('Replace failed: react-hot-loader');
  });
});
