// @flow

import path from 'path';

import { inquirer } from 'inquirer';
import { outputFileSync } from 'output-file-sync';
import { npmWhich } from 'npm-which';

import lernaCreate, { keywordQuestion } from '../lernaCreate';

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

      await lernaCreate('test', { base: './packages/cli' });
      expect(outputFileSync.destPaths).toEqual(
        [...expected, 'package.json']
          .map((fileName: string) => path.resolve('./packages/test', fileName))
          .sort(),
      );
    },
  );

  it('file exist', async (): Promise<void> => {
    await expect(
      lernaCreate('cli', { base: './packages/cli' }),
    ).rejects.toThrow('process exit');
  });

  it('can not find lerna', async (): Promise<void> => {
    npmWhich.throwError = true;

    await expect(
      lernaCreate('cli', { base: './packages/cli' }),
    ).rejects.toThrow('process exit');

    npmWhich.throwError = false;
  });

  it('not find workspaces', async (): Promise<void> => {
    npmWhich.alias = {
      lerna: __dirname,
    };

    await expect(
      lernaCreate('test', { base: './packages/cli' }),
    ).rejects.toThrow('process exit');

    npmWhich.alias = {};
  });
});

describe('keyword question', () => {
  test.each`
    name          | value | expected
    ${'filter'}   | ${''} | ${[]}
    ${'validate'} | ${[]} | ${'can not be empty'}
  `(
    'test $name',
    ({
      name,
      value,
      expected,
    }: {
      name: string,
      value: string | $ReadOnlyArray<string>,
      expected: string | $ReadOnlyArray<string>,
    }) => {
      expect(keywordQuestion[name](value)).toEqual(expected);
    },
  );
});
