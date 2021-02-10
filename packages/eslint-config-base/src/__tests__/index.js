// @flow

import fs from 'fs';
import path from 'path';

import { ESLint, typeof LintResult as LintResultType } from 'eslint';
import { hyphenate } from 'fbjs';

import dirTree, { type dirTreeNodeType } from '@mikojs/dir-tree';

import configs from '../index';

type messageType = $ElementType<
  $PropertyType<LintResultType, 'messages'>,
  number,
>;

// use to mock worker in @mikojs/miko/src/index.js
jest.mock('@mikojs/worker', () =>
  jest.fn().mockResolvedValue({
    addTracking: jest.fn(),
  }),
);

const root = path.resolve(__dirname, './__ignore__/files');
const expectErrorRegExp = /^[ ]*(\/\/|\*|\/\*\*) \$expectError /;
const expectedCache = {};
const testings = dirTree(root, {
  extensions: /\.js$/,
})
  .leaves()
  .map(({ data: { path: filePath, name } }: dirTreeNodeType) => [
    hyphenate(name.replace(/.js/, '')),
    filePath,
    fs
      .readFileSync(filePath, 'utf-8')
      .split(/\n/g)
      .map((text: string, index: number) => [index + 1, text])
      .filter(([line, text]: [number, string]) => expectErrorRegExp.test(text))
      .reduce(
        (
          result: $ReadOnlyArray<[number, string]>,
          [line, text]: [number, string],
        ) => [
          ...result,
          ...text
            .replace(expectErrorRegExp, '')
            .split(/, /)
            .map((key: string) => [
              /flowtype\/require-valid-file-annotation/.test(text)
                ? 1
                : line + 1,
              key,
            ]),
        ],
        [],
      ),
  ]);

describe('eslint', () => {
  beforeAll(async () => {
    (
      await new ESLint({
        cwd: root,
        baseConfig: configs,
        useEslintrc: false,
      }).lintFiles([root])
    ).forEach(({ filePath, messages }: LintResultType) => {
      expectedCache[filePath] = messages
        .filter(
          ({ ruleId }: messageType) =>
            ![
              'no-unused-vars',
              'no-warning-comments',
              'prettier/prettier',
            ].includes(ruleId),
        )
        .sort((a: messageType, b: messageType) =>
          a.line === b.line
            ? a.ruleId.localeCompare(b.ruleId)
            : a.line - b.line,
        );
    });
  });

  test('check amount of the testing files', () => {
    expect(testings.length).toBe(Object.keys(expectedCache).length);
  });

  test('check amount of rules', () => {
    const expected = Object.keys(expectedCache)
      .reduce(
        (result: $ReadOnlyArray<string>, filePath: string) =>
          expectedCache[filePath].reduce(
            (subResult: $ReadOnlyArray<string>, { ruleId }: messageType) =>
              subResult.includes(ruleId) ? subResult : [...subResult, ruleId],
            result,
          ),
        [],
      )
      .sort();
    const rules = Object.keys(configs?.rules || {})
      .filter((ruleName: string): boolean => {
        if (configs?.rules?.[ruleName] === 'warn') return false;

        switch (ruleName) {
          case 'arrow-parens':
            return !expected.includes('flowtype/require-parameter-type');
          case 'require-jsdoc':
            return !expected.includes('jsdoc/require-jsdoc');
          case 'flowtype/no-flow-fix-me-comments':
          case 'flowtype/generic-spacing':
          case 'no-warning-comments':
          case 'no-invalid-this':
          case 'babel/no-invalid-this':
          case 'valid-jsdoc':
            return false;
          default:
            return true;
        }
      })
      .sort();

    expect(rules).toEqual(expected);
  });

  describe.each(testings)(
    '%s',
    (
      name: string,
      filePath: string,
      rules: $ReadOnlyArray<[number, string]>,
    ) => {
      let cacheIndex: number = 0;

      test.each(rules)(
        'line: %d, ruleId: %s',
        (line: number, ruleId: string) => {
          expect(expectedCache[filePath][cacheIndex]).toEqual(
            expect.objectContaining({
              line,
              ruleId,
            }),
          );
        },
      );

      test('check rules amount', () => {
        expect(rules.length).toBe(expectedCache[filePath].length);
      });

      afterEach(() => {
        cacheIndex += 1;
      });
    },
  );
});
