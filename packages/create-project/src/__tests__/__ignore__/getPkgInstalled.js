// @flow

import configs from '@mikojs/configs/lib/configs';

type resultType = {|
  dependencies: { [string]: string },
  devDependencies: { [string]: string },
|};

const PASS_COMMANDS = [
  'git config --get user.name',
  'git config --get user.email',
  'yarn flow-typed install',
  'git status',
];

/**
 * @example
 * getPkgInstalled(['command'])
 *
 * @param {Array} cmds - commands array
 *
 * @return {object} - pkg object
 */
export default (cmds: $ReadOnlyArray<string>): resultType => {
  const pkgInstalled = cmds.reduce(
    (result: resultType, cmd: string): resultType => {
      if (/yarn add/.test(cmd)) {
        const key = /--dev/.test(cmd) ? 'devDependencies' : 'dependencies';

        return {
          ...result,
          [key]: cmd
            .replace(/yarn add (--dev )?/, '')
            .split(/ /)
            .reduce(
              (newResult: {}, pkgName: string) => ({
                ...newResult,
                [pkgName]: 'version',
              }),
              result[key],
            ),
        };
      }

      if (/yarn configs --install/.test(cmd)) {
        const configType = cmd.replace(/yarn configs --install /, '');
        const configPackages =
          // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
          configs[configType]?.install?.(['--dev']) ||
          (() => {
            throw new Error(`Can not find config type: ${configType}`);
          })();
        const isDevDependencies = configPackages[0] === '--dev';

        return {
          ...result,
          devDependencies: !isDevDependencies
            ? result.devDependencies
            : configPackages.slice(1).reduce(
                (devDependencies: {}, pkgName: string) => ({
                  ...devDependencies,
                  [pkgName]: 'version',
                }),
                result.devDependencies,
              ),
          dependencies: isDevDependencies
            ? result.dependencies
            : configPackages.reduce(
                (dependencies: {}, pkgName: string) => ({
                  ...dependencies,
                  [pkgName]: 'version',
                }),
                result.dependencies,
              ),
        };
      }

      if (!PASS_COMMANDS.includes(cmd))
        throw new Error(`Find not expect command: ${cmd}`);

      return result;
    },
    {
      devDependencies: {},
      dependencies: {},
    },
  );

  if (Object.keys(pkgInstalled.devDependencies).length === 0)
    delete pkgInstalled.devDependencies;

  if (Object.keys(pkgInstalled.dependencies).length === 0)
    delete pkgInstalled.dependencies;

  return pkgInstalled;
};
