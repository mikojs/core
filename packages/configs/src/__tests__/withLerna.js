// @flow

import withLerna from '../withLerna';

describe('with lerna', () => {
  describe.each(Object.keys(withLerna).map((key: string) => [key]))(
    '%s',
    (configName: string | 'exec' | 'babel' | 'server') => {
      test.each(Object.keys(withLerna[configName]).map((key: string) => [key]))(
        '%s',
        (eventName: string) => {
          switch (eventName) {
            case 'config':
              if (configName === 'exec')
                expect(withLerna[(configName: 'exec')].config({})).toEqual({
                  lerna: {
                    flow: [
                      'lerna',
                      'exec',
                      '"flow --quiet"',
                      '--stream',
                      '--concurrency',
                      '1',
                    ],
                  },
                });
              break;

            case 'run':
              if (
                configName === 'exec' ||
                configName === 'babel' ||
                configName === 'server'
              )
                expect(withLerna[configName].run([])).toEqual(
                  configName === 'exec'
                    ? []
                    : ['--config-file', '../../babel.config.js'],
                );
              break;

            default:
              expect(withLerna[configName][eventName]([])).toEqual(
                configName === 'exec' ? ['git-branch'] : ['-W'],
              );
              break;
          }
        },
      );
    },
  );

  describe('exec', () => {
    test.each`
      isChanged
      ${true}
      ${false}
    `(
      'run with --changed = $isChanged',
      ({ isChanged }: {| isChanged: boolean |}) => {
        expect(
          withLerna.exec.run([!isChanged ? '--test' : '--changed'])[0],
        ).toBe(!isChanged ? '--test' : '--since');
      },
    );

    test.each`
      isCi
      ${true}
      ${false}
    `('config with ci = $isCi', ({ isCi }: {| isCi: boolean |}) => {
      if (isCi) process.env.CI = 'true';
      else delete process.env.CI;

      expect(withLerna.exec.config({}).lerna.flow[2]).toBe(
        isCi ? '"flow --quiet && flow stop"' : '"flow --quiet"',
      );
    });
  });
});
