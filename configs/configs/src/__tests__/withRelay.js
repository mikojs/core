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
          withRelay[1].babel(
            isEmptyConfig
              ? {}
              : {
                  presets: [['@mikojs/base', {}]],
                  plugins: [['relay', {}]],
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
          withRelay[1].lint(
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
      withRelay[1].jest({
        testPathIgnorePatterns: [],
        coveragePathIgnorePatterns: [],
      }),
    ).toEqual({
      testPathIgnorePatterns: ['__tests__/__generated__'],
      coveragePathIgnorePatterns: ['__generated__'],
    });
  });

  test('exec', () => {
    expect(
      withRelay[1].exec({
        grep: [],
      }),
    ).toEqual({
      grep: ['--exclude', '**/__generated__/**'],
    });
  });
});
