// @flow

import fs from 'fs';
import path from 'path';

import { CLIEngine } from 'eslint';
import dirTree from 'directory-tree';
import * as d3 from 'd3-hierarchy';
import { hyphenate } from 'fbjs';

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

type dirTreeType = {
  data: {
    path: string,
    extension: string,
  },
};

const root = path
  .resolve(process.cwd(), './src');

const cli = new CLIEngine({
  cwd: root,
  ignore: false,
  rules: {
    'no-unused-vars': ['off'],
  },
});

const { results } = cli
  .executeOnFiles(['.']);

const eslintResult = results
  .filter(({ messages }: {
    messages: $ReadOnlyArray<string>
  }): boolean => messages.length !== 0);

const files = d3
  .hierarchy(dirTree(root))
  .leaves();

const testData = files
  .filter(({ data }: dirTreeType): boolean => {
    const { path: filePath, extension } = data;

    return /__testsFiles__/.test(filePath) && extension === '.js';
  })
  .map(({ data }: dirTree): testDataType => {
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
      .map((message: eslintInfoType, index: number): testTaskType => ({
        eslintInfo: message,
        expectError: expectErrors[index] || null,
      }));

    return {
      testName: hyphenate(name.replace(/.js/, '')),
      testTasks,
      checkErrorAmount: expectErrors.length === messages.length,
    };
  });


describe('eslint', () => {
  it('check amount of test files', () => {
    expect(eslintResult.length).toBe(testData.length);
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
            expect(ruleId).toBe(expectError);
          });
        });

        it('check error amount', () => {
          expect(checkErrorAmount).toBeTruthy();
        });
      });
    });
});
