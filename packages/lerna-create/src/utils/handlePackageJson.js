// @flow

import chalk from 'chalk';
import inquirer from 'inquirer';

import normalizedQuestions from './normalizedQuestions';

export const keywordQuestion = {
  filter: (val: string): $ReadOnlyArray<string> =>
    val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
  validate: (val: $ReadOnlyArray<string>) =>
    val.length !== 0 || 'can not be empty',
};

export default async (
  pkg: {|
    bin?: string,
    dependencies?: string,
    devDependencies?: string,
    keywords?: $ReadOnlyArray<string>,
  |},
  replaceFunc: string => string,
): Promise<string> => {
  const newPkg = { ...pkg };

  delete newPkg.bin;
  delete newPkg.dependencies;
  delete newPkg.devDependencies;

  const result = await inquirer.prompt(
    normalizedQuestions(
      ...['name', 'description', 'homepage', 'repository', 'keywords'].map(
        (key: string) => ({
          name: key,
          ...(key !== 'keywords'
            ? {
                default: replaceFunc(pkg[key]),
                message: chalk`{cyan (package.json)} ${key}`,
              }
            : {
                ...keywordQuestion,
                message: chalk`{cyan (package.json)} keywords (comma to split)`,
                // $FlowFixMe Flow does not yet support method or property calls in optional chains.
                default: pkg.keywords?.map(replaceFunc).join(','),
              }),
        }),
      ),
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
