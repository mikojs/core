// @flow

import path from 'path';

import { inquirer } from 'inquirer';
import { outputFileSync } from 'output-file-sync';

import lernaCreate from '../lernaCreate';

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
});
