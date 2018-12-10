// @flow

import inquirer from 'inquirer';

import { normalizedQuestions } from '@cat-org/utils';

export const keywordQuestion = {
  filter: (val: string): $ReadOnlyArray<string> =>
    val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
  validate: (val: $ReadOnlyArray<string>) =>
    val.length !== 0 || 'can not be empty',
};

export default async (
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
    normalizedQuestions('lerna-create')(
      ...['name', 'description', 'homepage', 'repository', 'keywords'].map(
        (key: string) => ({
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
