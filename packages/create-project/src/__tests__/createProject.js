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

import cmds from './__ignore__/cmds.js';

import base from 'stores/base';

test('create project', async () => {
  const projectDir = path.resolve(__dirname, './__ignore__/basic-usage');

  outputFileSync.destPaths = [];
  outputFileSync.contents = [];
  execa.cmds = [];
  inquirer.result = {
    private: false,
    description: 'package description',
    homepage: 'http://cat-org/package-homepage',
    repository: 'https://github.com/cat-org/core.git',
    keywords: ['keyword'],
  };

  await base.init({ projectDir });

  expect(
    d3DirTree(projectDir, { exclude: /.*\.swp/ })
      .leaves()
      .reduce(
        (
          result: number,
          { data: { path: filePath, extension } }: d3DirTreeNodeType,
        ): number => {
          const content = outputFileSync.contents
            .find(
              (_: string, contentIndex: number) =>
                filePath === outputFileSync.destPaths[contentIndex],
            )
            .replace(/git config --get user.name/g, 'username')
            .replace(/git config --get user.email/g, 'email')
            .replace(path.basename(projectDir), 'package-name');
          const expected = fs
            .readFileSync(filePath, { encoding: 'utf-8' })
            .replace(/\n$/, '');

          switch (extension) {
            case '.json':
              expect(
                prettier
                  .format(format(JSON.parse(content)), {
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
});
