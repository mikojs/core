// @flow

import path from 'path';

import rimraf from 'rimraf';

import findFlowDirs from 'utils/findFlowDirs';

/**
 * @example
 * command(['flow-typed', 'install'], '/folder')
 *
 * @param {Array} argv - argv array
 * @param {string} cwd - the folder where command runs
 */
export default async (argv: $ReadOnlyArray<string>, cwd: string) => {
  await Promise.all(
    findFlowDirs(process.cwd(), false).map(
      (folderPath: string) =>
        new Promise(resolve => {
          rimraf(path.resolve(folderPath, './flow-typed/npm'), resolve);
        }),
    ),
  );
};
