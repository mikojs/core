// @flow

import fs from 'fs';
import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { CLIEngine } from 'eslint';
import { hyphenate } from 'fbjs';

import { d3DirTree } from '@cat-org/utils';
import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import configs from '..';

type eslintInfoType = {
  ruleId: string,
  line: number,
  message: string,
};

type testTaskType = {
  eslintInfo: eslintInfoType,
  expectError: ?string,
};

type testDataType = {
  testName: string,
  testTasks: $ReadOnlyArray<testTaskType>,
  checkErrorAmount: boolean,
};

const root = path.resolve(__dirname, './__ignore__');

const cli = new CLIEngine({
  cwd: root,
  ignore: false,
  rules: {
    'no-unused-vars': 'off',
    'no-warning-comments': 'off',
  },
});

const { results } = cli.executeOnFiles(['.']);

const eslintResult = results.filter(
  ({ messages }: { messages: $ReadOnlyArray<string> }): boolean =>
    messages.length !== 0,
);

const files = d3DirTree(root, {
  extensions: /\.js$/,
}).leaves();
const ruleIds = [];

const testData = files.map(
  ({ data: { path: filePath, name } }: d3DirTreeNodeType): testDataType => {
    const { messages = [] } =
      eslintResult.find(
        ({ filePath: eslintFilePath }: { filePath: string }): boolean =>
          filePath === eslintFilePath,
      ) || {};

    const expectErrors = fs
      .readFileSync(filePath, 'utf-8')
      .split(/\n/g)
      .filter((text: string): boolean => /^[ ]*\/\/ \$expectError /.test(text))
      .map(
        (text: string): string => text.replace(/^[ ]*\/\/ \$expectError /, ''),
      );

    const testTasks = messages.map(
      (message: eslintInfoType, index: number): testTaskType => {
        const { ruleId } = message;

        if (!ruleIds.includes(ruleId)) {
          ruleIds.push(ruleId);
        }

        return {
          eslintInfo: message,
          expectError: expectErrors[index] || null,
        };
      },
    );

    return {
      testName: hyphenate(name.replace(/.js/, '')),
      testTasks,
      checkErrorAmount: expectErrors.length === messages.length,
    };
  },
);

describe('eslint', () => {
  it('check amount of test files', () => {
    expect(eslintResult.length).toBe(testData.length);
  });

  it('check amount of rules', () => {
    const testRules = Object.keys(configs?.rules || {})
      .filter(
        (ruleName: string): boolean => {
          switch (ruleName) {
            case 'arrow-parens':
              return !ruleIds.includes('flowtype/require-parameter-type');
            case 'flowtype/no-flow-fix-me-comments':
            case 'flowtype/generic-spacing':
            case 'no-warning-comments':
              return false;
            default:
              return true;
          }
        },
      )
      .sort();

    expect(ruleIds.sort()).toEqual(testRules);
  });

  testData.forEach(
    (
      { testName, testTasks, checkErrorAmount }: testDataType,
      index: number,
    ) => {
      describe(testName, () => {
        testTasks.forEach(
          ({
            eslintInfo: { ruleId, line, message },
            expectError,
          }: testTaskType) => {
            it(`[line: ${line}, rule: ${ruleId}] ${message}`, () => {
              expect(ruleId).toBe(expectError);
            });
          },
        );

        it('check error amount', () => {
          expect(checkErrorAmount).toBeTruthy();
        });
      });
    },
  );
});
