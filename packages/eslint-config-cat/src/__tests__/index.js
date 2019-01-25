// @flow

import fs from 'fs';
import path from 'path';

import { CLIEngine } from 'eslint';
import { hyphenate } from 'fbjs';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

/**
 * FIXME:
 * Owing to jest coverage, can not remove index
 * Remove it after upgrading jest
 */
import configs from '../index';

type eslintInfoType = {
  line: number,
  ruleId: string,
  message: string,
};

type testTaskType = [number, string, string, ?string];

type testDataType = [string, $ReadOnlyArray<testTaskType>, boolean];

const root = path.resolve(__dirname, './__ignore__');

const eslintResult = new CLIEngine({
  cwd: root,
  ignore: false,
  rules: {
    'no-unused-vars': 'off',
    'no-warning-comments': 'off',
    'prettier/prettier': 'off',
  },
})
  .executeOnFiles(['.'])
  .results.filter(
    ({ messages }: { messages: $ReadOnlyArray<string> }) =>
      messages.length !== 0,
  );

const ruleIds = [];

const testData = d3DirTree(root, {
  extensions: /\.js$/,
})
  .leaves()
  .map(
    ({ data: { path: filePath, name } }: d3DirTreeNodeType): testDataType => {
      const { messages = [] } =
        eslintResult.find(
          ({ filePath: eslintFilePath }: { filePath: string }) =>
            filePath === eslintFilePath,
        ) || {};

      const expectErrors = fs
        .readFileSync(filePath, 'utf-8')
        .split(/\n/g)
        .filter((text: string) => /^[ ]*\/\/ \$expectError /.test(text))
        .map((text: string) => text.replace(/^[ ]*\/\/ \$expectError /, ''));

      const testTasks = messages
        .sort((a: eslintInfoType, b: eslintInfoType) =>
          a.line === b.line
            ? a.ruleId.localeCompare(b.ruleId)
            : a.line - b.line,
        )
        .map(
          (
            { ruleId, line, message }: eslintInfoType,
            index: number,
          ): testTaskType => {
            if (!ruleIds.includes(ruleId)) ruleIds.push(ruleId);

            return [line, ruleId, message, expectErrors[index] || null];
          },
        );

      return [
        hyphenate(name.replace(/.js/, '')),
        testTasks,
        expectErrors.length === messages.length,
      ];
    },
  );

describe('eslint', () => {
  test('check amount of test files', () => {
    expect(eslintResult.length).toBe(testData.length);
  });

  test('check amount of rules', () => {
    const testRules = Object.keys(configs?.rules || {})
      .filter(
        (ruleName: string): boolean => {
          switch (ruleName) {
            case 'arrow-parens':
              return !ruleIds.includes('flowtype/require-parameter-type');
            case 'flowtype/no-flow-fix-me-comments':
            case 'flowtype/generic-spacing':
            case 'no-warning-comments':
            case 'no-invalid-this':
            case 'babel/no-invalid-this':
              return false;
            default:
              return true;
          }
        },
      )
      .sort();

    expect(ruleIds.sort()).toEqual(testRules);
  });

  describe.each(testData)(
    '%s',
    (
      testName: string,
      testTasks: $ReadOnlyArray<testTaskType>,
      checkErrorAmount: boolean,
    ) => {
      ([testName, testTasks, checkErrorAmount]: testDataType);

      test.each(testTasks)(
        '[line: %d, rule: %s] %s',
        (line: number, ruleId: string, message: string, expected: string) => {
          ([line, ruleId, message, expected]: testTaskType);

          expect(ruleId).toBe(expected);
        },
      );

      test('check error amount', () => {
        expect(checkErrorAmount).toBeTruthy();
      });
    },
  );
});
