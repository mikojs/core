#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import inquirer from 'inquirer';
import outputFileSync from 'output-file-sync';

import {
  handleUnhandledRejection,
  d3DirTree,
  normalizedQuestions,
} from '@cat-org/utils';

import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import cliOptions from 'utils/cliOptions';
import handlePackageJson from 'utils/handlePackageJson';

const normalized = normalizedQuestions('@cat-org/lerna-create');

handleUnhandledRejection();

(async (): Promise<void> => {
  const { newProject, rootPath, workspaces } = cliOptions(process.argv);

  const { existingProject } = await inquirer.prompt(
    normalized({
      type: 'list',
      name: 'existingProject',
      message: 'the path of the other lerna-managed project',
      choices: workspaces.reduce(
        (
          result: $ReadOnlyArray<{
            name: string,
            value: string,
          }>,
          workspace: string,
        ) => [
          ...result,
          ...d3DirTree(
            path.resolve(rootPath, workspace.replace(/\/\*$/, '')),
          ).children.map(
            ({ data: { name, path: value } }: d3DirTreeNodeType) => ({
              name: workspace.replace(/\*$/, name),
              value,
            }),
          ),
        ],
        [],
      ),
    }),
  );

  const existingFiles = d3DirTree(existingProject).children.filter(
    ({ data: { type } }: d3DirTreeNodeType) => type === 'file',
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
          await handlePackageJson(require(filePath), (text: string) =>
            // $FlowFixMe Flow does not yet support method or property calls in optional chains.
            text?.replace(
              new RegExp(path.basename(existingProject), 'g'),
              path.basename(newProject),
            ),
          ),
        );
        break;

      default:
        const { writable } = await inquirer.prompt(
          normalized({
            type: 'confirm',
            name: 'writable',
            message: chalk`copy {cyan ${name}} or not`,
          }),
        );

        if (writable) outputFileSync(newFilePath, fs.readFileSync(filePath));
        break;
    }
  }
})();
