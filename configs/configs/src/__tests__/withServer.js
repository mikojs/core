// @flow

import withServer from '../withServer';

describe('with server', () => {
  describe.each`
    isEmptyConfig
    ${false}
    ${true}
  `(
    'isEmptyConfig = $isEmptyConfig',
    ({ isEmptyConfig }: {| isEmptyConfig: boolean |}) => {
      test('babel', () => {
        expect(
          withServer.babel(
            isEmptyConfig
              ? {}
              : {
                  presets: [
                    [
                      '@mikojs/base',
                      {
                        '@mikojs/transform-flow': {
                          plugins: [['@babel/proposal-pipeline-operator', {}]],
                        },
                      },
                    ],
                  ],
                  plugins: [['@babel/proposal-pipeline-operator', {}]],
                },
          ),
        ).toEqual({
          presets: [
            [
              '@mikojs/base',
              {
                '@mikojs/transform-flow': {
                  plugins: [
                    [
                      '@babel/proposal-pipeline-operator',
                      {
                        proposal: 'minimal',
                      },
                    ],
                  ],
                },
              },
            ],
          ],
          plugins: [
            [
              '@babel/proposal-pipeline-operator',
              {
                proposal: 'minimal',
              },
            ],
          ],
        });
      });
    },
  );
});
