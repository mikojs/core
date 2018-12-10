#! /usr/bin/env node
// @flow

import path from 'path';

import inquirer from 'inquirer';

import {
  handleUnhandledRejection,
  d3DirTree,
  normalizedQuestions,
} from '@cat-org/utils';

import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import cliOptions from 'utils/cliOptions';

handleUnhandledRejection();

(async (): Promise<void> => {
  const { /* newProject, */ rootPath, workspaces } = cliOptions(process.argv);

  await inquirer.prompt(
    normalizedQuestions('@cat-org/lerna-create')({
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
})();
