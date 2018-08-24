// @flow

import fs from 'fs';

import simpleGit from 'simple-git';

import cliOptions from './cliOptions';

if (!fs.existsSync(cliOptions.projectDir)) fs.mkdirSync(cliOptions.projectDir);

const git = simpleGit(cliOptions.projectDir);

git.rawP = (argu, callback = val => val) =>
  new Promise((resolve, reject) =>
    git.raw(argu, (err, result) => {
      if (err) reject(err);
      else resolve(callback(result?.replace(/\n$/, '')));
    }),
  );

export default git;
