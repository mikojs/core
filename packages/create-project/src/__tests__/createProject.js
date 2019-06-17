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
      cmds: $ReadOnlyArray<string>,
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

      expect(
        d3DirTree(projectDir, { exclude: /.*\.swp/ })
          .leaves()
          .reduce(
            (
              result: number,
              { data: { path: filePath, extension } }: d3DirTreeNodeType,
            ): number => {
              const contentIndex = outputFileSync.destPaths.lastIndexOf(
                filePath,
              );

              if (contentIndex === -1)
                throw new Error(`Can not find ${filePath}`);

              const content = outputFileSync.contents[contentIndex]
                .replace(/git config --get user.name/g, 'username')
                .replace(/git config --get user.email/g, 'email')
                .replace(path.basename(projectDir), 'package-name');
              const expected = fs
                .readFileSync(filePath, { encoding: 'utf-8' })
                .replace(/\n$/, '');

              switch (extension) {
                case '.json':
                  const jsonContent = JSON.parse(content);

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

              return (
                result -
                outputFileSync.destPaths.filter(
                  (destPath: string) => destPath === filePath,
                ).length
              );
            },
            outputFileSync.contents.length,
          ),
      ).toBe(0);
      expect(execa.cmds).toEqual(cmds);
    },
  );
});
