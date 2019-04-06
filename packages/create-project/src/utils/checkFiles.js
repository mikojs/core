// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import inquirer from 'inquirer';
import outputFileSync from 'output-file-sync';

import normalizedQuestions from './normalizedQuestions';

const deprecatedFiles = [
  {
    pattern: /(babel.config.js|jest.config.js|\.eslintrc.js|\.prettierrc.js|\.lintstagedrc.js)/,
    message: 'we do not add the config files, we use `@cat-org/configs`',
  },
];

export default async (
  prevFiles: { [string]: string },
  newFiles: { [string]: string },
  projectDir: string,
): Promise<$ReadOnlyArray<string>> => {
  const addFiles = [];

  for (const file of Object.keys(newFiles)) {
    if (!Object.keys(prevFiles).includes(file)) {
      const { shouldAddFile } = await inquirer.prompt(
        normalizedQuestions({
          type: 'confirm',
          name: 'shouldAddFile',
          message: chalk`add the new file {bgCyan  ${file} } or not`,
        }),
      );

      if (shouldAddFile)
        outputFileSync(path.resolve(projectDir, file), newFiles[file]);

      addFiles.push(file);
    }
  }

  const removeFiles = [];

  for (const { pattern, message } of deprecatedFiles) {
    const removeFile = Object.keys(prevFiles).find((prevFile: string) =>
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
    ...Object.keys(prevFiles).filter(
      (prevFile: string) => !removeFiles.includes(prevFile),
    ),
    ...addFiles,
  ];
};
