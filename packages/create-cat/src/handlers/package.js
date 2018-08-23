// @flow

import path from 'path';

import envinfo from 'envinfo';
import inquirer from 'inquirer';
import { isEmail, isURL } from 'validator';
import { invariant } from 'fbjs';

import pkg from 'utils/pkg';
import cliOptions from 'utils/cliOptions';
import git from 'utils/git';

const noEmpty = str => (str.length > 0 ? true : 'Can not empty');

const addAuthor = async () => {
  const gitUserName = await git.rawP([
    'config',
    '--global',
    '--get',
    'user.name',
  ]);
  const gitUserEmail = await git.rawP([
    'config',
    '--global',
    '--get',
    'user.email',
  ]);

  inquirer
    .prompt([
      {
        name: 'userName',
        message: 'the user name of Github',
        when: !gitUserName,
        validate: noEmpty,
      },
      {
        name: 'userEmail',
        message: 'the user email of Github',
        when: !gitUserEmail,
        validate: str => (isEmail(str) ? true : 'Use like: example@gmail.com'),
      },
    ])
    .then(async ({ userName = gitUserName, userEmail = gitUserEmail }) => {
      if (!gitUserName)
        await git.rawP(['config', '--global', 'user.name', userName]);

      if (!gitUserEmail)
        await git.rawP(['config', '--global', 'user.email', userEmail]);

      pkg.author = `${userName} <${userEmail}>`;
    });
};

const addRepository = async () => {
  const repository = await git.rawP(['config', '--get', 'remote.origin.url']);

  invariant(
    repository,
    'can not find git.remote.origin.url. Set the remote.origin.url before creating project.',
  );

  pkg.repository = repository;
};

const addEngines = async () => {
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
};

const addInfo = () =>
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
      {
        name: 'keywords',
        message: 'the keywords of the project (comma to split)',
        when: !pkg.keywords,
        filter: str => str.split(/\s*,\s*/g),
      },
    ])
    .then(
      ({
        description = pkg.description,
        homepage = pkg.homepage,
        repository = pkg.repository,
        keywords = pkg.keywords,
      }) => {
        pkg.description = description;
        pkg.homepage = homepage;
        pkg.repository = repository;
        pkg.keywords = keywords;
      },
    );

export default async () => {
  if (!pkg.name) pkg.name = path.basename(path.resolve(cliOptions.projectDir));
  if (!pkg.version) pkg.version = '1.0.0';
  if (!pkg.license) pkg.license = 'MIT';
  if (!pkg.main) pkg.main = './lib/index.js';
  if (!pkg.author) await addAuthor();
  if (!pkg.repository) await addRepository();
  if (!pkg.engines) await addEngines();

  await addInfo();

  console.log(pkg);
};
