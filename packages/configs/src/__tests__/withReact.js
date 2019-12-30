// @flow

import withReact from '../withReact';

describe('with react', () => {
  test.each`
    checkTagNames
    ${'error'}
    ${['error', { definedTags: [] }]}
  `(
    'lint with jsdoc/check-tag-names = $checkTagNames',
    ({
      checkTagNames,
    }: {|
      checkTagNames:
        | string
        | [
            string,
            {
              definedTags: $ReadOnlyArray<string>,
            },
          ],
    |}) => {
      expect(
        withReact.lint.config({
          rules: {
            'jsdoc/check-tag-names': checkTagNames,
          },
        }),
      ).toEqual({
        rules: {
          'jsdoc/check-tag-names': [
            'error',
            {
              definedTags: ['react'],
            },
          ],
          'jsdoc/require-example': ['error', { exemptedBy: ['react'] }],
          'jsdoc/require-param': ['error', { exemptedBy: ['react'] }],
          'jsdoc/require-returns': ['error', { exemptedBy: ['react'] }],
        },
      });
    },
  );
});
