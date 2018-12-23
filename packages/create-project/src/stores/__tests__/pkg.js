// @flow

import { inquirer } from 'inquirer';

import pkg, { PKG_QUESTIONS } from '../pkg';

import ctx from './__ignore__/ctx';

/**
 * @example
 * notFind('')
 *
 * @param {string} argu - function argument
 */
const notFind = (argu: string) => {
  throw new Error('not find');
};

pkg.ctx = ctx;

test('pkg', async (): Promise<void> => {
  inquirer.result = {
    private: true,
    description: 'desc',
    homepage: 'https://github.com/cat-org/core',
    repository: 'https://github.com/cat-org/core.git',
    keywords: ['keyword'],
  };

  expect(await pkg.start(ctx)).toBeUndefined();
  expect(await pkg.end(ctx)).toBeUndefined();
  expect(pkg.storePkg.name).toBe('projectDir');
  expect(pkg.storePkg.private).toBeTruthy();
});

describe('pkg questions', () => {
  describe('validate', () => {
    describe.each`
      questionName    | success                                  | fail  | errorMessage
      ${'homepage'}   | ${'https://cat.org'}                     | ${''} | ${'must be url, for example: https://cat.org'}
      ${'repository'} | ${'https://github.com/cat-org/core.git'} | ${''} | ${'must be url or git ssh, for example: https://github.com/cat-org/core.git'}
      ${'keywords'}   | ${['keyword']}                           | ${[]} | ${'can not be empty'}
    `(
      '$questionName',
      ({
        questionName,
        success,
        fail,
        errorMessage,
      }: {
        questionName: string,
        success: string & $ReadOnlyArray<string>,
        fail: string & $ReadOnlyArray<string>,
        errorMessage: string,
      }) => {
        const {
          validate = notFind,
        }: {
          validate?: (string & $ReadOnlyArray<string>) => true | string,
        } =
          PKG_QUESTIONS.find(
            ({ name }: { name: string }) => name === questionName,
          ) || {};

        it('success', () => {
          expect(validate(success)).toBe(true);
        });

        it('fail', () => {
          expect(validate(fail)).toBe(errorMessage);
        });
      },
    );
  });

  describe('filter', () => {
    it('keywords', () => {
      const {
        filter = notFind,
      }: {
        filter?: string => $ReadOnlyArray<string>,
      } =
        PKG_QUESTIONS.find(
          ({ name }: { name: string }) => name === 'keywords',
        ) || {};

      expect(filter('keyword')).toEqual(['keyword']);
    });
  });
});
