#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import inquirer from 'inquirer';
import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection, d3DirTree } from '@cat-org/utils';

import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import handlePackageJson from 'utils/handlePackageJson';
import normalizedQuestions from 'utils/normalizedQuestions';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { newProject, rootPath, workspaces } = cliOptions(process.argv) || {};

  logger.info(
    chalk`Creating a new project in {green ${path.relative(
      process.cwd(),
      newProject,
    )}}`,
  );

  const { existingProject } = await inquirer.prompt(
    normalizedQuestions({
      type: 'list',
      name: 'existingProject',
      message: 'the path of the other lerna managed project',
      choices: workspaces.reduce(
        (
          result: $ReadOnlyArray<{
            name: string,
            value: string,
          }>,
          workspace: string,
        ) => [
          ...result,
          ...(
            d3DirTree(path.resolve(rootPath, workspace.replace(/\/\*$/, '')))
              .children || []
          ).map(({ data: { name, path: value } }: d3DirTreeNodeType) => ({
            name: workspace.replace(/\*$/, name),
            value,
          })),
        ],
        [],
      ),
    }),
  );

  const existingFiles = d3DirTree(existingProject).children.filter(
    ({ data: { type } }: d3DirTreeNodeType) => type === 'file',
  );

  /**
   * @example
   * replaceFunc('test')
   *
   * @param {string} text - existing string
   *
   * @return {string} - new string
   */
  const replaceFunc = (text: string) =>
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    text?.replace(
      new RegExp(path.basename(existingProject), 'g'),
      path.basename(newProject),
    );

  for (const {
    data: { name, path: filePath },
  } of existingFiles) {
    const newFilePath = path.resolve(
      newProject,
      filePath.replace(`${existingProject}/`, ''),
    );

    switch (name) {
      case 'package.json':
        outputFileSync(
          newFilePath,
          await handlePackageJson(require(filePath), replaceFunc),
        );
        break;

      default:
        const { writable } = await inquirer.prompt(
          normalizedQuestions({
            type: 'confirm',
            name: 'writable',
            message: chalk`copy {cyan ${name}} or not`,
          }),
        );

        if (writable)
          outputFileSync(
            newFilePath,
            replaceFunc(fs.readFileSync(filePath, 'utf-8')),
          );
        break;
    }
  }

  logger.succeed('Done');
})();
