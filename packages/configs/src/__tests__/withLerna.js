// @flow

import fs from 'fs';
import path from 'path';

import withLerna from '../withLerna';

import { cacheFolder } from 'utils/flowTypedCache';

const targetFolder = path.resolve(cacheFolder, './@mikojs/core');
const sourceFolder = path.resolve('./flow-typed/npm');

describe('with lerna', () => {
  beforeAll(() => {
    // $FlowFixMe FIXME: flow type error
    fs.rmdirSync(cacheFolder, { recursive: true });
  });

  test.each`
    cliName                       | ci         | expected
    ${'flow'}                     | ${'true'}  | ${"flow stop && flow --quiet && flow stop && lerna exec 'flow stop && flow --quiet && flow stop' --stream --concurrency 1"}
    ${'flow'}                     | ${'false'} | ${"flow --quiet && lerna exec 'flow --quiet' --stream --concurrency 1"}
    ${'flow-typed:restore-cache'} | ${'true'}  | ${'echo "no cache"'}
    ${'flow-typed:save-cache'}    | ${'true'}  | ${`rm -rf ${targetFolder} && cp -r ${sourceFolder} ${targetFolder}`}
    ${'flow-typed:restore-cache'} | ${'true'}  | ${`rm -rf ${sourceFolder} && cp -r ${targetFolder} ${sourceFolder}`}
    ${'dev'}                      | ${'true'}  | ${'lerna exec "miko babel -w" --parallel --stream --since main'}
    ${'husky:pre-commit'}         | ${'true'}  | ${'miko build --since main && miko flow --since main && lint-staged'}
    ${'clean'}                    | ${'true'}  | ${`lerna exec 'rm -rf lib flow-typed/npm' --parallel && lerna exec 'rm -rf .flowconfig' --parallel --ignore @mikojs/core && lerna clean && rm -rf ./.changelog`}
  `(
    'run miko with cliName = $cliName',
    ({
      cliName,
      ci,
      expected,
    }: {|
      cliName: string,
      ci: string,
      expected: string,
    |}) => {
      process.env.CI = ci;

      const { command } = withLerna.miko({
        clean: { command: '', description: '' },
        build: { command: '', description: '' },
      })[cliName];

      expect(typeof command === 'string' ? command : command()).toBe(expected);
    },
  );
});
