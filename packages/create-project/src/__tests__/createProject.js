// @flow

import fs from 'fs';
import path from 'path';

import prettier from 'prettier';
import { format } from 'prettier-package-json';
import { outputFileSync } from 'output-file-sync';
import { inquirer } from 'inquirer';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import base from 'stores/base';

test('create project', async () => {
  const projectDir = path.resolve(__dirname, './__ignore__/basic-usage');

  outputFileSync.destPaths = [];
  outputFileSync.contents = [];
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

          expect(
            extension === '.json'
              ? prettier
                  .format(format(JSON.parse(content)), {
                    singleQuote: true,
                    trailingComma: 'all',
                    parser: 'json',
                  })
                  .replace(/\n$/, '')
              : content,
          ).toBe(
            fs.readFileSync(filePath, { encoding: 'utf-8' }).replace(/\n$/, ''),
          );

          return result - 1;
        },
        outputFileSync.contents.length,
      ),
  ).toBe(0);
});
