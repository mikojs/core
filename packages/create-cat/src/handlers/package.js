// @flow

import path from 'path';

import envinfo from 'envinfo';
import inquirer from 'inquirer';

import pkg from 'utils/pkg';
import cliOptions from 'utils/cliOptions';

const noEmpty = str => (str.length > 0 ? true : 'Can not empty');

const addInfo = () =>
  inquirer.prompt([
    {
      name: 'description',
      message: 'the description of the package.json',
      when: !pkg.description,
      validate: noEmpty,
    },
    /** TODO remove */
    {
      name: 'author',
      message: 'the author of the package.json',
      when: !pkg.author,
      validate: str =>
        str.match(/.* <.*@.*>/)
          ? true
          : 'Should be `example <example@gmail.com>`',
    },
    {
      name: 'homepage',
      message: 'the homepage of the project',
      when: !pkg.homepage,
      validate: noEmpty,
    },
    /** TODO remove */
    {
      name: 'repository',
      message: 'the url of the repo',
      when: !pkg.repository,
      validate: noEmpty,
    },
    {
      name: 'keywords',
      message: 'Package keywords (comma to split)',
      when: !pkg.keywords,
      filter: str => str.split(/\s*,\s*/g),
    },
  ]);

export default async () => {
  if (!pkg.name) pkg.name = path.basename(path.resolve(cliOptions.projectDir));
  if (!pkg.version) pkg.version = '1.0.0';
  if (!pkg.license) pkg.license = 'MIT';
  if (!pkg.main) pkg.main = './lib/index.js';
  if (!pkg.engines) {
    const { Binaries: bin } = JSON.parse(
      await envinfo.run(
        {
          Binaries: ['Node', 'Yarn', 'npm'],
        },
        { json: true },
      ),
    );

    pkg.engines = Object.keys(bin).reduce(
      (result, key: string) => ({
        ...result,
        [key.toLowerCase()]: `>= ${bin[key].version}`,
      }),
      {},
    );
  }

  console.log(await addInfo());
};
