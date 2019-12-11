// @flow

import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';

import execa from 'execa';
import envinfo from 'envinfo';
import ora from 'ora';
import chalk from 'chalk';
import debug from 'debug';

import { d3DirTree, createLogger, requireModule } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import findFlowDirs from 'utils/findFlowDirs';

const debugLog = debug('nested-flow:commands:flow-typed:install');
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

  debugLog({ version });

  return !version ? [] : ['-f', version];
};

/**
 * @example
 * createNotFoundFolder('/path')
 *
 * @param {string} folder - folder path
 */
const createNotFoundFolder = (folder: string) => {
  if (!fs.existsSync(path.dirname(folder)))
    createNotFoundFolder(path.dirname(folder));

  if (fs.existsSync(folder)) return;

  debugLog({ createNotFoundFolder: folder });
  fs.mkdirSync(folder);
};

/**
 * @example
 * link('/source', '/target')
 *
 * @param {string} source - source path
 * @param {string} target - target path
 */
const link = (source: string, target: string) => {
  if (fs.existsSync(target)) return;

  debugLog({ source, target });
  createNotFoundFolder(path.dirname(target));
  fs.symlinkSync(source, target, fs.statSync(source).isFile() ? 'file' : 'dir');
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
): Promise<() => boolean> => {
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
  let hasError: boolean = false;

  subprocess.stdout.pipe(transform);
  subprocess.stderr.pipe(transform);

  try {
    await subprocess;
  } catch (e) {
    debugLog(e);
    hasError = true;
  }

  return (): boolean => {
    logger.start(
      chalk`Linking the {green flow-typed} files to the nested folders...`,
    );
    findFlowDirs(process.cwd(), false).forEach(
      (folderPath: string, index: number, flowDirs: $ReadOnlyArray<string>) => {
        debugLog({ folderPath });
        flowDirs
          .filter(
            (filePath: string) =>
              filePath.includes(folderPath) && filePath !== folderPath,
          )
          .forEach((childFolderPath: string) => {
            const pkgPath = path.resolve(childFolderPath, './package.json');
            const pkg = fs.existsSync(pkgPath) ? requireModule(pkgPath) : {};
            const rootFolder = path.resolve(folderPath, './flow-typed/npm');

            debugLog({ childFolderPath, pkgPath, pkg });
            d3DirTree(rootFolder)
              .leaves()
              .reduce(
                (
                  result: $ReadOnlyArray<string>,
                  { data: { path: filePath } }: d3DirTreeNodeType,
                ): $ReadOnlyArray<string> => {
                  const moduleName = path.relative(rootFolder, filePath);

                  link(
                    filePath,
                    path.resolve(
                      childFolderPath,
                      './flow-typed/npm',
                      moduleName,
                    ),
                  );

                  return result.filter(
                    (key: string) => !moduleName.includes(key),
                  );
                },
                [
                  ...Object.keys(pkg.dependencies || {}),
                  ...Object.keys(pkg.devDependencies || {}),
                ],
              )
              .forEach((key: string) => {
                debugLog({ moduleName: key });
                link(
                  path.resolve(folderPath, './node_modules', key),
                  path.resolve(childFolderPath, './node_modules', key),
                );
              });
          });
      },
    );
    logger.succeed(
      chalk`The {green flow-typed} files have linked to the nested flow folders`,
    );

    return hasError;
  };
};
