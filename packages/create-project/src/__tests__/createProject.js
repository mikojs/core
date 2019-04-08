// @flow

import path from 'path';

import prettier from 'prettier';
import { format } from 'prettier-package-json';
import { outputFileSync } from 'output-file-sync';
import { inquirer } from 'inquirer';
// $FlowFixMe jest mock
import { execa } from 'execa';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import createProject, { type inquirerResultType } from './__ignore__/createProject';

import base from 'stores/base';

jest.mock('memoize-one', () => jest.fn((func: mixed) => func));
jest.mock('fs');

describe('create project', () => {
  test.each(createProject)(
    '%s',
    async (
      name: string,
      projectDir: string,
      inquirerResult: inquirerResultType,
      cmds: $ReadOnlyArray<string>,
    ) => {
      outputFileSync.destPaths = [];
      outputFileSync.contents = [];
      execa.cmds = [];
      inquirer.result = inquirerResult;

      await base.init({ projectDir, check: false });

      outputFileSync.destPaths.reverse();
      outputFileSync.contents.reverse();

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
              const expected = jest
                .requireActual('fs')
                .readFileSync(filePath, { encoding: 'utf-8' })
                .replace(/\n$/, '');

              switch (extension) {
                case '.json': {
                  const jsonContent = JSON.parse(content);

                  delete jsonContent.useNpm;

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
                }

                case '.md':
                  expect(content).toBe(
                    expected.replace(
                      /<!-- badges.start -->(.|\n)*<!-- badges.end -->/,
                      '<!-- badges.start --><!-- badges.end -->',
                    ),
                  );
                  break;

                default: {
                  if (/\.cat-lock/.test(filePath)) {
                    const jsonContent = JSON.parse(content);
                    const jsonExpected = JSON.parse(expected);
                    const promptNames = ['Npmignore-prompt', 'Pkg-prompt'];

                    promptNames.forEach((promptName: string) => {
                      Object.keys(jsonExpected[promptName]).forEach(
                        (key: string) => {
                          promptNames
                            .filter(
                              (fileName: string) => promptName !== fileName,
                            )
                            .forEach((otherKey: string) => {
                              delete jsonContent[otherKey][key];
                            });
                        },
                      );
                    });

                    expect(jsonContent).toEqual(jsonExpected);

                    return (
                      result -
                      outputFileSync.destPaths.filter(
                        (destPath: string) => destPath === filePath,
                      ).length
                    );
                  } else expect(content).toBe(expected);
                  break;
                }
              }

              return result - 1;
            },
            outputFileSync.contents.length,
          ),
      ).toBe(0);
      expect(execa.cmds).toEqual(cmds);
    },
  );
});
