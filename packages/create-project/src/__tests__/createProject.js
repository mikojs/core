// @flow

import fs from 'fs';
import path from 'path';

import prettier from 'prettier';
import { format } from 'prettier-package-json';
import { outputFileSync } from 'output-file-sync';
import { inquirer } from 'inquirer';
// $FlowFixMe jest mock
import { execa } from 'execa';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';
import configs from '@mikojs/configs/lib/configs';

import testings, {
  type inquirerResultType,
  type contextType,
} from './__ignore__/testings';

import base from 'stores/base';
import pkg from 'stores/pkg';

const storePkg = {
  license: 'MIT',
  version: '1.0.0',
  main: './lib/index.js',
};
const PASS_COMMANDS = [
  'git config --get user.name',
  'git config --get user.email',
  'yarn flow-typed install',
  'git status',
];

describe('create project', () => {
  beforeEach(() => {
    Object.keys(pkg.storePkg).forEach((key: string) => {
      delete pkg.storePkg[key];
    });

    Object.keys(storePkg).forEach((key: string) => {
      pkg.storePkg[key] = storePkg[key];
    });
  });

  test('check testing cases', () => {
    expect(
      testings
        .slice(0, testings.length / 2)
        .map(([name]: [string]) => `lerna/${name}`),
    ).toEqual(
      testings.slice(testings.length / 2).map(([name]: [string]) => name),
    );
  });

  test.each(testings)(
    '%s',
    async (
      name: string,
      projectDir: string,
      inquirerResult: inquirerResultType,
      context?: contextType,
    ) => {
      outputFileSync.destPaths = [];
      outputFileSync.contents = [];
      execa.cmds = [];
      inquirer.result = inquirerResult;

      await base.init({
        projectDir,
        skipCommand: false,
        lerna: false,
        ...context,
      });

      const pkgInstalled = execa.cmds.reduce(
        (
          result: {| devDependencies: {}, dependencies: {} |},
          cmd: string,
        ): {|
          devDependencies: {},
          dependencies: {},
        |} => {
          if (/yarn add --dev/.test(cmd))
            return {
              ...result,
              devDependencies: cmd
                .replace(/yarn add --dev /, '')
                .split(/ /)
                .reduce(
                  (devDependencies: {}, pkgName: string) => ({
                    ...devDependencies,
                    [pkgName]: 'version',
                  }),
                  result.devDependencies,
                ),
            };

          if (/yarn add/.test(cmd))
            return {
              ...result,
              dependencies: cmd
                .replace(/yarn add /, '')
                .split(/ /)
                .reduce(
                  (dependencies: {}, pkgName: string) => ({
                    ...dependencies,
                    [pkgName]: 'version',
                  }),
                  result.dependencies,
                ),
            };

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

      expect(
        d3DirTree(projectDir, { exclude: /.*\.swp/ })
          .leaves()
          .reduce(
            (
              result: number,
              { data: { path: filePath, extension } }: d3DirTreeNodeType,
            ): number => {
              const content = (
                outputFileSync.contents.find(
                  (_: string, contentIndex: number) =>
                    filePath === outputFileSync.destPaths[contentIndex],
                ) ||
                (() => {
                  throw new Error(`Can not find ${filePath}`);
                })()
              )
                .replace(/git config --get user.name/g, 'username')
                .replace(/git config --get user.email/g, 'email')
                .replace(path.basename(projectDir), 'package-name');
              const expected = fs
                .readFileSync(filePath, { encoding: 'utf-8' })
                .replace(/\n$/, '');

              switch (extension) {
                case '.json':
                  const jsonContent = {
                    ...JSON.parse(content),
                    ...pkgInstalled,
                  };

                  expect(
                    prettier
                      .format(format(jsonContent), {
                        singleQuote: true,
                        trailingComma: 'all',
                        parser: 'json',
                      })
                      .replace(/\n$/, ''),
                  ).toBe(expected);
                  break;

                case '.md':
                  expect(content).toBe(
                    expected.replace(
                      /<!-- badges.start -->(.|\n)*<!-- badges.end -->/,
                      '<!-- badges.start --><!-- badges.end -->',
                    ),
                  );
                  break;

                default:
                  expect(content).toBe(expected);
                  break;
              }

              return result - 1;
            },
            outputFileSync.contents.length,
          ),
      ).toBe(0);
    },
  );
});
