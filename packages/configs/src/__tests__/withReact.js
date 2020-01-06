// @flow

import withReact from '../withReact';

describe('with react', () => {
  describe.each`
    isEmptyConfig
    ${false}
    ${true}
  `(
    'isEmptyConfig = $isEmptyConfig',
    ({ isEmptyConfig }: {| isEmptyConfig: boolean |}) => {
      test('babel', () => {
        expect(
          withReact.babel.config(
            isEmptyConfig
              ? {}
              : {
                  presets: [['@babel/react', {}]],
                  plugins: [['@babel/proposal-class-properties', {}]],
                },
          ),
        ).toEqual({
          presets: ['@babel/react'],
          plugins: [
            [
              '@babel/proposal-class-properties',
              {
                loose: true,
              },
            ],
          ],
        });
      });

      test('lint', () => {
        expect(
          withReact.lint.config(
            isEmptyConfig
              ? {}
              : {
                  rules: {
                    'jsdoc/check-tag-names': ['error', {}],
                    'jsdoc/require-example': ['error', {}],
                    'jsdoc/require-param': ['error', {}],
                    'jsdoc/require-returns': ['error', {}],
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
