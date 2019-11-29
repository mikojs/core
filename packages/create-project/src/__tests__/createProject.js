// @flow

import fs from 'fs';
import path from 'path';

import prettier from 'prettier';
import { format } from 'prettier-package-json';
import outputFileSync from 'output-file-sync';
import inquirer from 'inquirer';
import execa from 'execa';
import chalk from 'chalk';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import testings, {
  type inquirerResultType,
  type contextType,
} from './__ignore__/testings';
import getPkgInstalled from './__ignore__/getPkgInstalled';

import base from 'stores/base';
import pkg from 'stores/pkg';

const storePkg = {
  license: 'MIT',
  version: '1.0.0',
  main: './lib/index.js',
};
const mockLog = jest.fn();

describe('create project', () => {
  beforeEach(() => {
    Object.keys(pkg.storePkg).forEach((key: string) => {
      delete pkg.storePkg[key];
    });

    Object.keys(storePkg).forEach((key: string) => {
      pkg.storePkg[key] = storePkg[key];
    });
  });

  test('check the amount of the testing cases', () => {
    expect(
      testings
        .slice(0, testings.length / 2)
        .map(([name]: [string]) => `lerna/${name}`),
    ).toEqual(
      testings.slice(testings.length / 2).map(([name]: [string]) => name),
    );
  });

  describe.each(testings)(
    '%s',
    (
      name: string,
      projectDir: string,
      inquirerResult: inquirerResultType,
      context?: contextType,
    ) => {
      beforeEach(async () => {
        mockLog.mockClear();
        outputFileSync.mockClear();
        execa.mockClear();
        execa.mockResolvedValue({ stdout: 'mock-execa' });
        inquirer.prompt.mockResolvedValue(inquirerResult);
        global.console.info = mockLog;

        await base.init({
          projectDir,
          skipCommand: false,
          lerna: false,
          verbose: true,
          ...context,
        });
      });

      test('check the commands', () => {
        const cmds = execa.mock.calls.filter(
          ([cmd]: [string]) => cmd !== 'git',
        );

        expect(mockLog).toHaveBeenCalledTimes(cmds.length);
        cmds.forEach(([cmd, argu]: [string, $ReadOnlyArray<string>]) => {
          expect(mockLog).toHaveBeenCalledWith(
            chalk`{blue ℹ }{blue {bold @mikojs/create-project}} Run command: {green ${[
              cmd,
              ...argu,
            ].join(' ')}}`,
          );
        });
      });

      describe('check the files', () => {
        const checkFiles = d3DirTree(projectDir, {
          exclude: [/.*\.swp/, /__generated__/],
        })
          .leaves()
          .map(({ data: { path: filePath, extension } }: d3DirTreeNodeType) => [
            path.relative(projectDir, filePath),
            filePath,
            extension,
          ]);

        test('check the amount of the checking files', () => {
          expect(checkFiles.length).toBe(outputFileSync.mock.calls.length);
        });

        test.each(checkFiles)(
          'check `%s`',
          (info: string, filePath: string, extension: string) => {
            const content = (outputFileSync.mock.calls.find(
              ([outputFilePath]: [string]) => filePath === outputFilePath,
            ) ||
              (() => {
                throw new Error(`Can not find ${filePath}`);
              })())[1]
              .replace(/git config --get user.name/g, 'username')
              .replace(/git config --get user.email/g, 'email')
              .replace(path.basename(projectDir), 'package-name');
            const expected = fs
              .readFileSync(filePath, { encoding: 'utf-8' })
              .replace(/\n$/, '');

            if (/__tests__\/__ignore__\/.*\/__tests__/.test(filePath))
              expect(
                fs.existsSync(filePath.replace(/__ignore__/, 'testFiles')),
              ).toBeTruthy();

            switch (extension) {
              case '.json':
                const jsonContent = {
                  ...JSON.parse(content),
                  ...getPkgInstalled(),
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
          },
        );
      });
    },
  );
});
