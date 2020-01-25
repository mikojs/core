// @flow

import withCss from '../withCss';

describe('with css', () => {
  describe.each`
    isEmptyConfig
    ${false}
    ${true}
  `(
    'isEmptyConfig = $isEmptyConfig',
    ({ isEmptyConfig }: {| isEmptyConfig: boolean |}) => {
      test('babel', () => {
        expect(
          withCss.babel(
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
                extensions: ['.css'],
                devMode: true,
                keepImport: false,
                extractCss: {
                  dir: './lib',
                  relativeRoot: './src',
                  filename: '[path]/[name].css',
                },
              },
            ],
            [
              '@mikojs/import-css',
              {
                test: /\.css$/,
              },
            ],
          ],
        });
      });

      test('lint-staged', () => {
        expect(
          withCss['lint-staged'](
            isEmptyConfig
              ? {}
              : {
                  '*.css': ['git add'],
                },
          ),
        ).toEqual({
          '*.css': ['yarn prettier --parser css --write', 'git add'],
        });
      });
    },
  );
});
