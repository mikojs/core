// @flow

import execa from 'execa';

import configs from '@mikojs/configs/lib/configs';

type resultType = {
  dependencies?: { [string]: string },
  devDependencies?: { [string]: string },
};

const PASS_COMMANDS = [
  'git config --get user.name',
  'git config --get user.email',
  'yarn flow-typed install',
  'git status',
];

/**
 * @example
 * getPkgInstalled()
 *
 * @return {resultType} - pkg object
 */
export default () =>
  execa.mock.calls.reduce(
    (
      result: resultType,
      [cmd, argu]: [string, $ReadOnlyArray<string>],
    ): resultType => {
      if (cmd === 'yarn' && argu[0] === 'add') {
        const key = argu.includes('--dev') ? 'devDependencies' : 'dependencies';

        return {
          ...result,
          [key]: argu.reduce(
            (newResult: $Values<resultType>, arguKey: string) =>
              ['add', '--dev'].includes(arguKey)
                ? newResult
                : {
                    ...newResult,
                    [arguKey]: 'latest',
                  },
            result[key],
          ),
        };
      }

      if (cmd === 'yarn' && argu[0] === 'configs' && argu[1] === 'install') {
        const configType = argu[argu.length - 1];
        const configPackages =
          // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
          configs[configType]?.install?.(['--dev']) ||
          (() => {
            throw new Error(`Can not find config type: ${configType}`);
          })();
        const isDevDependencies = configPackages[0] === '--dev';
        const key = isDevDependencies ? 'devDependencies' : 'dependencies';

        return {
          ...result,
          [key]: (!isDevDependencies
            ? configPackages
            : configPackages.slice(1)
          ).reduce(
            (newResult: ?$Values<resultType>, pkgName: string) =>
              /** need to ignore flow-bin, flow-typed can not use flow-bin@latest */
              pkgName === 'flow-bin'
                ? { ...newResult }
                : {
                    ...newResult,
                    [pkgName]: 'latest',
                  },
            result[key],
          ),
        };
      }

      if (!PASS_COMMANDS.includes([cmd, ...argu].join(' ')))
        throw new Error(`Find not expect command: ${[cmd, ...argu].join(' ')}`);

      return result;
    },
    {},
  );
