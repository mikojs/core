// @flow

import chalk from 'chalk';
import inquirer from 'inquirer';
import execa from 'execa';

import normalizedQuestions from './normalizedQuestions';

const deprecatedCommands = [];

export default async (
  prevCommands: $ReadOnlyArray<string>,
  newCommands: $ReadOnlyArray<string>,
  projectDir: string,
): Promise<$ReadOnlyArray<string>> => {
  const addCommands = [];

  for (const command of newCommands) {
    if (!prevCommands.includes(command)) {
      const { shouldRunCommand } = await inquirer.prompt(
        normalizedQuestions({
          type: 'confirm',
          name: 'shouldRunCommand',
          message: chalk`run the new command {bgCyan  ${command} } or not`,
        }),
      );

      if (shouldRunCommand) {
        try {
          await execa.shell(command, {
            cwd: projectDir,
            stdio: 'inherit',
          });
        } catch (e) {
          throw e;
        }
      }

      addCommands.push(command);
    }
  }

  const removeCommands = [];

  for (const { pattern, message, command } of deprecatedCommands) {
    const removeCommand = prevCommands.find((prevCommand: string) =>
      pattern.test(prevCommand),
    );

    if (removeCommand) {
      const { shouldRunCommand } = await inquirer.prompt(
        normalizedQuestions({
          type: 'confirm',
          name: 'shouldRunCommand',
          message: chalk`${message}, run {bgCyan  ${command} } to fix this or not`,
        }),
      );

      if (shouldRunCommand) {
        try {
          await execa.shell(command, {
            cwd: projectDir,
            stdio: 'inherit',
          });
        } catch (e) {
          throw e;
        }
      }

      removeCommands.push(removeCommand);
    }
  }

  return [
    ...prevCommands.filter(
      (prevCommand: string) => !removeCommands.includes(prevCommand),
    ),
    ...addCommands,
  ];
};
