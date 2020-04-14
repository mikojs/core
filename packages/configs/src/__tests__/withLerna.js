// @flow

import path from 'path';

import withLerna from '../withLerna';

describe('with lerna', () => {
  describe.each(Object.keys(withLerna).map((key: string) => [key]))(
    '%s',
    (configName: string | 'exec' | 'babel' | 'server') => {
      const config =
        typeof withLerna[configName] === 'function'
          ? { config: withLerna[configName] }
          : withLerna[configName];

      test.each(Object.keys(config).map((key: string) => [key]))(
        '%s',
        (eventName: string) => {
          switch (eventName) {
            case 'config':
              if (configName === 'exec')
                expect(
                  withLerna[(configName: 'exec')].config({}),
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
                    : ['--config-file', path.resolve('./babel.config.js')],
                );
              break;

            default:
              expect(config[eventName]([])).toEqual(
                configName === 'exec'
                  ? ['lerna', 'lerna-changelog', 'git-branch', 'flow-mono-cli']
                  : ['-W'],
              );
              break;
          }
        },
      );
    },
  );

  describe('exec', () => {
    test('install with filtering standard-version', () => {
      expect(withLerna.exec.install(['standard-version'])).toEqual([
        'lerna',
        'lerna-changelog',
        'git-branch',
        'flow-mono-cli',
      ]);
    });

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
          ]),
        ).toEqual(
          !isChanged
            ? ['lerna:test', '--test']
            : ['lerna:test', '--since', 'master'],
        );
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
