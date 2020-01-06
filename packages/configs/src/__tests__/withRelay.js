// @flow

import withRelay from '../withRelay';

describe('with relay', () => {
  describe.each`
    isEmptyConfig
    ${false}
    ${true}
  `(
    'isEmptyConfig = $isEmptyConfig',
    ({ isEmptyConfig }: {| isEmptyConfig: boolean |}) => {
      test('babel', () => {
        expect(
          withRelay[1].react.config(
            isEmptyConfig
              ? {}
              : {
                  presets: ['@mikojs/base', {}],
                  plugins: ['relay', {}],
                },
          ),
        ).toEqual({
          presets: [
            [
              '@mikojs/base',
              {
                '@mikojs/transform-flow': {
                  ignore: /__generated__/,
                },
              },
            ],
          ],
          plugins: ['relay'],
        });
      });

      test('lint', () => {
        expect(
          withRelay[1].lint.config(
            isEmptyConfig
              ? {}
              : {
                  rules: {
                    'jsdoc/check-tag-names': ['error', {}],
                  },
                },
          ),
        ).toEqual({
          rules: {
            'jsdoc/check-tag-names': [
              'error',
              {
                definedTags: ['relay'],
              },
            ],
          },
        });
      });
    },
  );

  test('jest', () => {
    expect(
      withRelay[1].jest.config({
        testPathIgnorePatterns: [],
        coveragePathIgnorePatterns: [],
      }),
    ).toEqual({
      testPathIgnorePatterns: ['__tests__/__generated__'],
      coveragePathIgnorePatterns: ['__generated__'],
    });
  });
});
