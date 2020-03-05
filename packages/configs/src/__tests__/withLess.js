// @flow

import withLess from '../withLess';

describe('with less', () => {
  describe.each`
    isEmptyConfig
    ${false}
    ${true}
  `(
    'isEmptyConfig = $isEmptyConfig',
    ({ isEmptyConfig }: {| isEmptyConfig: boolean |}) => {
      test('babel', () => {
        expect(
          withLess[1].babel(
            isEmptyConfig
              ? {}
              : {
                  plugins: [
                    ['css-modules-transform', {}],
                    ['@mikojs/import-css', {}],
                  ],
                },
          ),
        ).toEqual({
          plugins: [
            [
              'css-modules-transform',
              {
                extensions: ['.less'],
                extractCss: {
                  filename: '[path]/[name].less',
                },
              },
            ],
            [
              '@mikojs/import-css',
              {
                test: /\.less$/,
              },
            ],
          ],
        });
      });

      test('lint-staged', () => {
        expect(
          withLess[1]['lint-staged'](
            isEmptyConfig
              ? {}
              : {
                  '*.less': [],
                },
          ),
        ).toEqual({
          '*.less': ['prettier --parser less --write'],
        });
      });
    },
  );
});
