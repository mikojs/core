// @flow

import lint, { type rulesType } from '../lint';

test('lint', () => {
  expect(
    lint.rules(
      { 'jsdoc/check-tag-names': 'error' },
      {
        'jsdoc/check-tag-names': ([rule, options]: $NonMaybeType<
          $PropertyType<rulesType, 'jsdoc/check-tag-names'>,
        >) => [rule || 'error', options],
      },
    ),
  ).toEqual({
    'jsdoc/check-tag-names': 'error',
  });
});
