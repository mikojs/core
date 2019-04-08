// @flow

import chalk from 'chalk';
import inquirer from 'inquirer';
import execa from 'execa';

import normalizedQuestions from './normalizedQuestions';

const deprecatedCommands = [
  {
    pattern: /TODO: just for testing/,
    message: 'Just for testing',
    command: 'echo "test"',
  },
];

export default async (
  prevCommands: $ReadOnlyArray<string>,
  newCommands: $ReadOnlyArray<string>,
  projectDir: string,
): Promise<$ReadOnlyArray<string>> => {
  const addCommands = [];

  for (const command of newCommands) {
    if (!prevCommands.includes(command)) {
      const { shouldRunAddCommand } = await inquirer.prompt(
        normalizedQuestions({
          type: 'confirm',
          name: 'shouldRunAddCommand',
          message: chalk`run the new command {bgCyan  ${command} } or not`,
        }),
      );

      if (shouldRunAddCommand) {
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
      const { shouldRunRemoveCommand } = await inquirer.prompt(
        normalizedQuestions({
          type: 'confirm',
          name: 'shouldRunRemoveCommand',
          message: chalk`${message}, run {bgCyan  ${command} } to fix this or not`,
        }),
      );

      if (shouldRunRemoveCommand) {
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
