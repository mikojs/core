// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import inquirer from 'inquirer';
import outputFileSync from 'output-file-sync';
import { diffTrimmedLines } from 'diff';

import normalizedQuestions from './normalizedQuestions';

const deprecatedFiles = [
  {
    pattern: /(babel.config.js|jest.config.js|\.eslintrc.js|\.prettierrc.js|\.lintstagedrc.js)/,
    message: 'we do not add the config files, we use `@cat-org/configs`',
  },
];

export default async (
  prevFiles: $ReadOnlyArray<string>,
  newFiles: { [string]: string },
  projectDir: string,
): Promise<$ReadOnlyArray<string>> => {
  const addFiles = [];

  for (const file of Object.keys(newFiles)) {
    const filePath = path.resolve(projectDir, file);

    if (!prevFiles.includes(file)) {
      const { shouldAddFile } = await inquirer.prompt(
        normalizedQuestions({
          type: 'confirm',
          name: 'shouldAddFile',
          message: chalk`add the new file {bgCyan  ${file} } or not`,
        }),
      );

      if (shouldAddFile) outputFileSync(filePath, newFiles[file]);

      addFiles.push(file);
    } else {
      const diff = diffTrimmedLines(
        fs.readFileSync(filePath, 'utf-8'),
        newFiles[file],
      );

      if (diff.length !== 1) {
        const { checking } = await inquirer.prompt(
          normalizedQuestions({
            type: 'expand',
            name: 'checking',
            message: chalk`find conflict with {bgCyan  ${file} }`,
            choices: [
              {
                key: 'y',
                name: 'Overwrite',
                value: 'overwrite',
              },
              {
                key: 'd',
                name: 'Show diff',
                value: 'diff',
              },
              new inquirer.Separator(),
              {
                key: 'x',
                name: 'Abort',
                value: 'abort',
              },
            ],
          }),
        );

        switch (checking) {
          case 'overwrite':
            outputFileSync(filePath, newFiles[file]);
            break;

          case 'diff': {
            const { log } = console;

            diff.forEach(
              ({
                value,
                added,
                removed,
              }: {
                value: $ReadOnlyArray<string>,
                added: ?boolean,
                removed: ?boolean,
              }) => {
                value.forEach((str: string) => {
                  if (added) log(chalk`{green +${str}}`);
                  else if (removed) log(chalk`{red -${str}}`);
                  else log(` ${str}`);
                });
              },
            );

            const { shouldOverwrite } = await inquirer.prompt(
              normalizedQuestions({
                type: 'confirm',
                name: 'shouldOverwrite',
                message: 'overwrite the old file or not',
              }),
            );

            if (shouldOverwrite) outputFileSync(filePath, newFiles[file]);

            break;
          }

          default:
            break;
        }
      }
    }
  }

  const removeFiles = [];

  for (const { pattern, message } of deprecatedFiles) {
    const removeFile = prevFiles.find((prevFile: string) =>
      pattern.test(prevFile),
    );

    if (removeFile) {
      const { shouldRemoveFile } = await inquirer.prompt(
        normalizedQuestions({
          type: 'confirm',
          name: 'shouldRemoveFile',
          message: chalk`${message}, remove {bgCyan  ${removeFile} } to fix this or not`,
        }),
      );

      if (shouldRemoveFile) fs.unlinkSync(path.resolve(projectDir, removeFile));

      removeFiles.push(removeFile);
    }
  }

  return [
    ...prevFiles.filter((prevFile: string) => !removeFiles.includes(prevFile)),
    ...addFiles,
  ];
};
