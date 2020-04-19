// @flow

import lint, { type rulesType } from '../lint';

test.each`
  rules
  ${{ 'jsdoc/check-tag-names': 'error' }}
  ${{ 'jsdoc/check-tag-names': ['error'] }}
`('lint', ({ rules }: {| rules: $ReadOnlyArray<string> |}) => {
  expect(
    lint.rules(rules, {
      'jsdoc/check-tag-names': ([rule]: $NonMaybeType<
        $PropertyType<rulesType, 'jsdoc/check-tag-names'>,
      >) => [rule || 'error'],
    }),
  ).toEqual({
    'jsdoc/check-tag-names': 'error',
  });
});
