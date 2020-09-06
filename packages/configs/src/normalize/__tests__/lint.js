// @flow

import lint, { type rulesType, type lintType } from '../lint';

test.each`
  rules
  ${{ 'jsdoc/check-tag-names': 'error' }}
  ${{ 'jsdoc/check-tag-names': ['error'] }}
`('lint', ({ rules }: {| rules: $PropertyType<lintType, 'rules'> |}) => {
  expect(
    lint.rules(rules, {
      /**
       * @param {Array} option - prev lint rule options
       * @param {string} option.0 - lint rule name
       *
       * @return {Array} - new lint rule options
       */
      'jsdoc/check-tag-names': ([rule]: $NonMaybeType<
        $PropertyType<rulesType, 'jsdoc/check-tag-names'>,
      >) => [rule || 'error'],
    }),
  ).toEqual({
    'jsdoc/check-tag-names': 'error',
  });
});
