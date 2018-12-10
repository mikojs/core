// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import inquirer from 'inquirer';
import npmWhich from 'npm-which';
import outputFileSync from 'output-file-sync';

import { d3DirTree, normalizedQuestions } from '@cat-org/utils';

import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import logger from './logger';
import handlePackageJson from './handlePackageJson';

const WORKSPACE_PATTERN = /\/\*$/;

export default async ({
  existingProject,
  newProject,
}: {
  existingProject: string,
  newProject: string,
}): Promise<void> => {
  // Find root path
  const rootPath = await new Promise(resolve => {
    npmWhich(process.cwd())('lerna', (err: mixed, binPath: string) => {
      if (err) logger.fail(chalk`Can not find {red lerna} in the project`);

      resolve(path.resolve(binPath, '../../..'));
    });
  });
  const { workspaces = [] } = require(path.resolve(rootPath, 'package.json'));

  if (workspaces.length === 0)
    logger.fail(chalk`Can not find the workspcaes in the {cyan package.json}`);

  // get path
  const {
    targetWorkspace = workspaces[0].replace(WORKSPACE_PATTERN, ''),
  } = await inquirer.prompt(
    normalizedQuestions('lerna-create')({
      type: 'list',
      name: 'targetWorkspace',
      message: 'choice workspace',
      when: workspaces.length !== 1,
      choices: workspaces.map((workspace: string) =>
        workspace.replace(WORKSPACE_PATTERN, ''),
      ),
    }),
  );

  // get folder path
  const targetPath = path.resolve(rootPath, targetWorkspace, newProject);

  if (fs.existsSync(targetPath))
    logger.fail(
      chalk`Project exits: {red ${path.relative(process.cwd(), targetPath)}}`,
    );

  // write files
  const existingFiles = d3DirTree(existingProject).children.filter(
    ({ data: { type } }: d3DirTreeNodeType) => type === 'file',
  );

  for (const {
    data: { name, path: filePath },
  } of existingFiles) {
    const newFilePath = path.resolve(
      targetPath,
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
          normalizedQuestions('lerna-create')({
            type: 'confirm',
            name: 'writable',
            message: chalk`copy {cyan ${name}} or not`,
          }),
        );

        if (writable) outputFileSync(newFilePath, fs.readFileSync(filePath));
        break;
    }
  }
};
