// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import inquirer from 'inquirer';
import npmWhich from 'npm-which';
import outputFileSync from 'output-file-sync';

import { d3DirTree, normalizedQuestions } from '@cat-org/utils';

import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import logger from 'utils/logger';

const WORKSPACE_PATTERN = /\/\*$/;
const PACKAGE_KEYS = [
  'name',
  'description',
  'homepage',
  'repository',
  'keywords',
];

const normalized = normalizedQuestions('lerna-create');

export const keywordQuestion = {
  filter: (val: string): $ReadOnlyArray<string> =>
    val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
  validate: (val: $ReadOnlyArray<string>) =>
    val.length !== 0 || 'can not be empty',
};

/**
 * @example
 * handlePackageJson({}, text => text.replace(/\//, ''))
 *
 * @param {Object} pkg - pkg data
 * @param {Function} replaceFunc - replace function
 *
 * @return {string} - pkg string
 */
const handlePackageJson = async (
  pkg: {
    dependencies?: string,
    devDependencies?: string,
    keywords?: $ReadOnlyArray<string>,
  },
  replaceFunc: string => string,
): Promise<string> => {
  const newPkg = { ...pkg };

  delete pkg.dependencies;
  delete pkg.devDependencies;

  const result = await inquirer.prompt(
    normalized(
      ...PACKAGE_KEYS.map((key: string) => ({
        name: key,
        ...(key !== 'keywords'
          ? {
              default: replaceFunc(pkg[key]),
            }
          : {
              ...keywordQuestion,
              message: 'keywords (comma to split)',
              // $FlowFixMe Flow does not yet support method or property calls in optional chains.
              default: pkg.keywords?.map(replaceFunc).join(','),
            }),
      })),
    ),
  );

  return JSON.stringify(
    {
      ...newPkg,
      ...result,
    },
    null,
    2,
  );
};

export default async (
  newFileName: string,
  { base }: { base: string },
): Promise<void> => {
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
    baseFolder = path.resolve(base),
    targetWorkspace = workspaces[0].replace(WORKSPACE_PATTERN, ''),
  } = await inquirer.prompt(
    normalized(
      {
        type: 'list',
        name: 'baseFolder',
        message: 'the path of the other lerna-managed project',
        when: !base,
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
              path.resolve(rootPath, workspace.replace(WORKSPACE_PATTERN, '')),
            ).children.map(
              ({ data: { name, path: value } }: d3DirTreeNodeType) => ({
                name,
                value,
              }),
            ),
          ],
          [],
        ),
      },
      {
        type: 'list',
        name: 'targetWorkspace',
        message: 'choice workspace',
        when: workspaces.length !== 1,
        choices: workspaces.map((workspace: string) =>
          workspace.replace(WORKSPACE_PATTERN, ''),
        ),
      },
    ),
  );

  // get folder path
  const targetPath = path.resolve(rootPath, targetWorkspace, newFileName);

  if (fs.existsSync(targetPath))
    logger.fail(
      chalk`Project exits: {red ${path.relative(process.cwd(), targetPath)}}`,
    );

  // write files
  const baseFiles = d3DirTree(path.resolve(baseFolder)).children.filter(
    ({ data: { type } }: d3DirTreeNodeType) => type === 'file',
  );

  for (const {
    data: { name, path: filePath },
  } of baseFiles) {
    const newFilePath = path.resolve(
      targetPath,
      filePath.replace(`${baseFolder}/`, ''),
    );

    switch (name) {
      case 'package.json':
        outputFileSync(
          newFilePath,
          await handlePackageJson(require(filePath), (text: string) =>
            // $FlowFixMe Flow does not yet support method or property calls in optional chains.
            text?.replace(
              new RegExp(path.basename(baseFolder), 'g'),
              newFileName,
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
};
