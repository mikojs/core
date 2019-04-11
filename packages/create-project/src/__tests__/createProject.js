// @flow

import fs from 'fs';
import path from 'path';

import prettier from 'prettier';
import { format } from 'prettier-package-json';
import { outputFileSync } from 'output-file-sync';
import { inquirer } from 'inquirer';
// $FlowFixMe jest mock
import { execa } from 'execa';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import { version } from '../../package.json';

import testings, { type inquirerResultType } from './__ignore__/testings';

import base from 'stores/base';
import pkg from 'stores/pkg';

describe('create project', () => {
  beforeEach(() => {
    delete pkg.storePkg.private;
  });

  test.each(testings)(
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

      await base.init({ projectDir, skipCommand: false });

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
                .replace(/create-project version/g, version)
                .replace(/\n$/, '');

              switch (extension) {
                case '.json':
                  const jsonContent = JSON.parse(content);

                  if (!jsonContent.private) delete jsonContent.private;

                  delete jsonContent.action;
                  delete jsonContent.useNpm;
                  delete jsonContent.useServer;

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
      expect(execa.cmds).toEqual(cmds);
    },
  );
});
