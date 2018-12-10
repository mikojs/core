// @flow

import path from 'path';

import { inquirer } from 'inquirer';
import { outputFileSync } from 'output-file-sync';
import { npmWhich } from 'npm-which';

import lernaCreate from '../lernaCreate';

const defaultArgu = {
  existingProject: path.resolve('./packages/lerna-create'),
  newProject: path.resolve('./packages/test'),
};

describe('lerna create', () => {
  beforeEach(() => {
    outputFileSync.destPaths = [];
  });

  test.each`
    writable | expected
    ${true}  | ${['.npmignore']}
    ${false} | ${[]}
  `(
    'answer with writable = $writable',
    async ({
      writable,
      expected,
    }: {
      writable: boolean,
      expected: $ReadOnlyArray<string>,
    }): Promise<void> => {
      inquirer.result = {
        name: 'name',
        description: 'description',
        homepage: 'homepage',
        repository: 'repository',
        keywords: 'keywords',
        writable,
      };

      await lernaCreate(defaultArgu);
      expect(outputFileSync.destPaths).toEqual(
        [...expected, 'package.json']
          .map((fileName: string) => path.resolve('./packages/test', fileName))
          .sort(),
      );
    },
  );

  it('not find workspaces', async (): Promise<void> => {
    npmWhich.alias = {
      lerna: __dirname,
    };

    await expect(lernaCreate(defaultArgu)).rejects.toThrow('process exit');

    npmWhich.alias = {};
  });

  it('file exist', async (): Promise<void> => {
    await expect(
      lernaCreate({
        ...defaultArgu,
        newProject: path.resolve('./packages/lerna-create'),
      }),
    ).rejects.toThrow('process exit');
  });

  it('not find lerna', async (): Promise<void> => {
    npmWhich.throwError = true;

    await expect(
      lernaCreate({
        ...defaultArgu,
        newProject: path.resolve('./packages/lerna-create'),
      }),
    ).rejects.toThrow('process exit');

    npmWhich.throwError = false;
  });
});
