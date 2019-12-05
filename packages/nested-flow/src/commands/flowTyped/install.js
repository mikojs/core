// @flow

import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';

import execa from 'execa';
import envinfo from 'envinfo';
import ora from 'ora';
import chalk from 'chalk';

import { d3DirTree, createLogger } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import findFlowDirs from 'utils/findFlowDirs';

const logger = createLogger('@mikojs/nested-configs', ora());

/**
 * @example
 * addFlowVersion()
 *
 * @return {Array} - if the version can be found, use to add the version arguments
 */
const addFlowVersion = async (): Promise<$ReadOnlyArray<string>> => {
  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
  const version = JSON.parse(
    await envinfo.run(
      {
        npmPackages: ['flow-bin'],
      },
      { json: true },
    ),
  ).npmPackages?.['flow-bin']?.wanted.replace(/\^/, '');

  return !version ? [] : ['-f', version];
};

/**
 * @example
 * command(['flow-typed', 'install'], '/folder')
 *
 * @param {Array} argv - argv array
 * @param {string} cwd - the folder where command runs
 *
 * @return {Function} - the end function
 */
export default async (
  argv: $ReadOnlyArray<string>,
  cwd: string,
): Promise<() => void> => {
  const subprocess = execa(
    argv[0],
    [
      ...argv.slice(1),
      ...(argv.includes('-f') || argv.includes('--flowVersion')
        ? []
        : await addFlowVersion()),
    ],
    {
      cwd,
    },
  );
  const transform = new Writable({
    write: (chunk: Buffer | string, encoding: string, callback: () => void) => {
      process.stdout.write(
        chunk
          .toString()
          .replace(
            /(flow-typed\/npm)/g,
            path.relative(process.cwd(), path.resolve(cwd, './flow-typed/npm')),
          ),
      );
      callback();
    },
  });

  subprocess.stdout.pipe(transform);
  subprocess.stderr.pipe(transform);

  await subprocess;

  return () => {
    logger.start(
      chalk`Linking the {green flow-typed} files to the nested folders...`,
    );
    findFlowDirs(process.cwd(), false).forEach(
      (folderPath: string, index: number, flowDirs: $ReadOnlyArray<string>) => {
        const childFolders = flowDirs.filter(
          (filePath: string) =>
            filePath.includes(folderPath) && filePath !== folderPath,
        );

        if (childFolders.length === 0) return;

        childFolders.forEach((childFolderPath: string) => {
          d3DirTree(path.resolve(folderPath, './flow-typed/npm'))
            .leaves()
            .forEach(
              ({ data: { path: filePath, name } }: d3DirTreeNodeType) => {
                const linkedFilePath = path.resolve(
                  childFolderPath,
                  './flow-typed/npm',
                  name,
                );

                if (fs.existsSync(linkedFilePath)) return;

                fs.linkSync(filePath, linkedFilePath);
              },
            );
        });
      },
    );
    logger.succeed(
      chalk`The {green flow-typed} files have linked to the nested flow folders`,
    );
  };
};
