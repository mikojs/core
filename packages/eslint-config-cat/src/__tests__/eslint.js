// @flow

import fs from 'fs';
import path from 'path';

import { CLIEngine } from 'eslint';
import { hyphenate } from 'fbjs';

import { d3DirTree } from 'cat-utils';
// eslint-disable-next-line max-len
import type { d3DirTreeType } from 'cat-utils/src/definitions/d3DirTree.js.flow';

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

const root = path
  .resolve(__dirname, './../');

const cli = new CLIEngine({
  cwd: root,
  ignore: false,
  rules: {
    'no-unused-vars': 'off',
    'no-warning-comments': 'off',
  },
});

const { results } = cli
  .executeOnFiles(['.']);

const eslintResult = results
  .filter(({ messages }: {
    messages: $ReadOnlyArray<string>,
  }): boolean => messages.length !== 0);

const files = d3DirTree(root).leaves();
const ruleIds = [];

const testData = files
  .filter(({ data }: d3DirTreeType): boolean => {
    const { path: filePath, extension } = data;

    return /__tests__\/__ignore__/.test(filePath) && extension === '.js';
  })
  .map(({ data }: d3DirTreeType): testDataType => {
    const { path: filePath, name } = data;

    const { messages = [] } = eslintResult
      .find(({ filePath: eslintFilePath }: {
        filePath: string,
      }): boolean => filePath === eslintFilePath) || {};

    const expectErrors = fs
      .readFileSync(filePath, 'utf-8')
      .split(/\n/g)
      .filter((text: string): boolean => /^[ ]*\/\/ \$expectError /.test(text))
      .map((text: string): string => (
        text.replace(/^[ ]*\/\/ \$expectError /, '')
      ));

    const testTasks = messages
      .map((message: eslintInfoType, index: number): testTaskType => {
        const { ruleId } = message;

        if (!ruleIds.includes(ruleId)) {
          ruleIds.push(ruleId);
        }

        return {
          eslintInfo: message,
          expectError: expectErrors[index] || null,
        };
      });

    return {
      testName: hyphenate(name.replace(/.js/, '')),
      testTasks,
      checkErrorAmount: expectErrors.length === messages.length,
    };
  });

describe('eslint', () => {
  it('check amount of test files', () => {
    expect(eslintResult.length)
      .toBe(testData.length);
  });

  it('check amount of rules', () => {
    // FIXME: https://github.com/babel/babel-eslint/issues/595
    // eslint-disable-next-line no-undef
    const testRules = Object.keys(configs?.rules || {})
      .filter((ruleName: string): boolean => {
        switch (ruleName) {
          case 'arrow-parens':
            return !ruleIds.includes('flowtype/require-parameter-type');
          case 'flowtype/no-flow-fix-me-comments':
          case 'no-warning-comments':
            return false;
          default: return true;
        }
      })
      .sort();

    expect(ruleIds.sort())
      .toEqual(testRules);
  });

  testData
    .forEach(({
      testName,
      testTasks,
      checkErrorAmount,
    }: testDataType, index: number) => {
      describe(testName, () => {
        testTasks.forEach(({ eslintInfo, expectError }: testTaskType) => {
          const { ruleId, line, message } = eslintInfo;

          it(`[line: ${line}, rule: ${ruleId}] ${message}`, () => {
            expect(ruleId)
              .toBe(expectError);
          });
        });

        it('check error amount', () => {
          expect(checkErrorAmount)
            .toBeTruthy();
        });
      });
    });
});
