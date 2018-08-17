// @flow

import path from 'path';

import * as diff from 'diff';
import inquirer from 'inquirer';
import chalk from 'chalk';

import cliOptions from 'utils/cliOptions';

const checkOverwrite = name =>
  inquirer.prompt([
    {
      name: 'overwrite',
      type: 'expand',
      message: chalk`conflict on {green ${name}}:`,
      choices: [
        {
          key: 'y',
          name: chalk`overwrite {green ${name}}`,
          value: 'overwrite',
        },
        {
          key: 'n',
          name: chalk`abort {green ${name}}`,
          value: 'abort',
        },
        {
          key: 'a',
          name: 'overwrite this one and all next',
          value: 'overwriteAll',
        },
        {
          key: 'd',
          name: chalk`show the difference between the {green ${name}} files`,
          value: 'diff',
        },
      ],
    },
  ]);

const stringToArray = (content, signal = ' ') =>
  content
    .replace(/\n$/, '')
    .split('\n')
    .map(text => `${signal} ${text}`)
    .join('\n');

const showDiff = (relativeFilePath, filePath, diffContent) =>
  console.log(chalk`
{green + ${relativeFilePath.replace(/^\.\//, '@cat-org/create-cat: ')}}
{red - ${path.relative(filePath, process.cwd())}}

${diffContent
    .map(({ value, added, removed }) => {
      if (added) return chalk`{green ${stringToArray(value, '+')}}`;

      if (removed) return chalk`{red ${stringToArray(value, '-')}}`;

      return stringToArray(value).replace(
        /(.*\n.*\n.*\n)(.*\n)*(.*\n.*\n.*\n?)/,
        chalk`$1{gray ↓\n↓ hide no changing code\n↓\n}$3`,
      );
    })
    .join('\n')}
`);

export default async node => {
  const {
    data: { name, content, fileContent, relativeFilePath, filePath },
  } = node;
  const diffContent =
    !content || !fileContent ? [] : diff.diffTrimmedLines(fileContent, content);

  node.data.diff = diffContent;
  node.data.output = null;

  if (diffContent.length > 1) {
    if (cliOptions.overwriteAll) node.data.output = content;
    else {
      const { overwrite } = await checkOverwrite(name);

      switch (overwrite) {
        case 'overwrite':
          node.data.output = content;
          break;

        case 'overwriteAll':
          node.data.output = content;
          cliOptions.overwriteAll = true;
          break;

        case 'diff': {
          showDiff(relativeFilePath, filePath, diffContent);

          const { shouldOverwrite } = await inquirer.prompt([
            {
              name: 'shouldOverwrite',
              type: 'confirm',
              message: 'overwrite or not?',
              default: 'y',
            },
          ]);

          node.data.output = shouldOverwrite ? content : fileContent;
          break;
        }

        case 'abort':
          node.data.output = fileContent;
          break;

        default:
          break;
      }
    }
  }
};
