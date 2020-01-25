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
                expect(
                  withLerna[(configName: 'exec')].config({ clean: [] }),
                ).not.toBeUndefined();
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
                configName === 'exec'
                  ? ['lerna', 'git-branch', 'flow-mono-cli']
                  : ['-W'],
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
          withLerna.exec.run([
            'lerna:test',
            !isChanged ? '--test' : '--changed',
          ])[1],
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

      expect(withLerna.exec.config({ clean: [] }).lerna.flow[2]).toBe(
        isCi ? '"flow --quiet && flow stop"' : '"flow --quiet"',
      );
    });
  });
});
