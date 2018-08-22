// @flow

import path from 'path';

import envinfo from 'envinfo';
import inquirer from 'inquirer';
import { isEmail, isURL } from 'validator';

import pkg from 'utils/pkg';
import cliOptions from 'utils/cliOptions';
import git from 'utils/git';

const noEmpty = str => (str.length > 0 ? true : 'Can not empty');

const addGitConfig = (userName, userEmail) =>
  inquirer
    .prompt([
      {
        name: 'userName',
        message: 'the userName of Github',
        when: !userName,
        validate: noEmpty,
      },
      {
        name: 'userEmail',
        message: 'the email of Github',
        when: !userEmail,
        validate: str => (isEmail(str) ? true : 'Use like: example@gmail.com'),
      },
    ])
    .then(async ({ userName, userEmail }) => {
      if (userName)
        await git.rawP(['config', '--global', 'user.name', userName]);

      if (userEmail)
        await git.rawP(['config', '--global', 'user.email', userEmail]);

      return {
        userName,
        userEmail,
      };
    });

const addInfo = async () =>
  inquirer
    .prompt([
      {
        name: 'description',
        message: 'the description of the project',
        when: !pkg.description,
        validate: noEmpty,
      },
      {
        name: 'homepage',
        message: 'the homepage of the project',
        when: !pkg.homepage,
        validate: str => (isURL(str) ? true : 'Must be link'),
      },
      /** TODO remove */
      {
        name: 'repository',
        message: 'the url of the project',
        when: !pkg.repository,
        validate: str => (isURL(str) ? true : 'Must be link'),
      },
      {
        name: 'keywords',
        message: 'the keywords of the project (comma to split)',
        when: !pkg.keywords,
        filter: str => str.split(/\s*,\s*/g),
      },
    ])
    .then(({ description, homepage, repository, keywords }) => {
      pkg.description = description;
      pkg.homepage = homepage;
      pkg.repository = repository;
      pkg.keywords = keywords;
    });

export default async () => {
  if (!pkg.name) pkg.name = path.basename(path.resolve(cliOptions.projectDir));
  if (!pkg.version) pkg.version = '1.0.0';
  if (!pkg.license) pkg.license = 'MIT';
  if (!pkg.main) pkg.main = './lib/index.js';

  if (!pkg.author) {
    const userName = await git.rawP(['config', '--get', 'user.name'], val =>
      val.replace(/\n$/, ''),
    );
    const userEmail = await git.rawP(['config', '--get', 'user.email'], val =>
      val.replace(/\n$/, ''),
    );
    const newConfig = await addGitConfig(userName, userEmail);

    pkg.author = `${newConfig.userName || userName} <${newConfig.userEmail ||
      userEmail}>`;
  }

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

  await addInfo();

  console.log(pkg);
};
