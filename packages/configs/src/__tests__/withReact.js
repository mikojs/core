// @flow

import withReact from '../withReact';

describe('with react', () => {
  test.each`
    isEmptyConfig
    ${false}
    ${true}
  `(
    'lint with isStrOptions = $isStrOptions',
    ({ isEmptyConfig }: {| isEmptyConfig: boolean |}) => {
      expect(
        withReact.lint.config(
          isEmptyConfig
            ? {}
            : {
                rules: {
                  'jsdoc/check-tag-names': ['error', { definedTags: [] }],
                  'jsdoc/require-example': ['error', { exemptedBy: [] }],
                  'jsdoc/require-param': ['error', { exemptedBy: [] }],
                  'jsdoc/require-returns': ['error', { exemptedBy: [] }],
                },
              },
        ),
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

  test('jest', () => {
    expect(
      withReact.jest.config({
        setupFiles: [],
      }),
    ).toEqual({
      setupFiles: ['@mikojs/jest/lib/react'],
    });
  });
});
