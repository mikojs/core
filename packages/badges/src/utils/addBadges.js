// @flow

import fs from 'fs';
import path from 'path';

import { emptyFunction } from 'fbjs';

import getRepoInfo from './getRepoInfo';
import buildBadges, { type badgeType } from './buildBadges';

type ctxType = {|
  rootPath: string,
  pkg: {
    [string]: string,
    engines?: {|
      [string]: string,
    |},
  },
|};

const START_COMMENT = '<!-- badges.start -->';
const END_COMMENT = '<!-- badges.end -->';

/**
 * @param {string} readme - readme content
 * @param {ctxType} ctx - readme context
 *
 * @return {Promise<string>} - modified readme
 */
export default async (
  readme: string,
  { rootPath, pkg: { name, homepage, engines = {} } }: ctxType,
): Promise<?string> => {
  const repoInfo = await getRepoInfo();
  const badges = buildBadges(
    [
      {
        filePath: './.circleci/config.yml',
        badgeName: 'circleci',
        image: `https://img.shields.io/circleci/project/github/${repoInfo}/main.svg`,
        link: `https://circleci.com/gh/${repoInfo}`,
      },
      {
        filePath: './.npmignore',
        badgeName: 'npm',
        image: `https://img.shields.io/npm/v/${name}.svg`,
        link: `https://www.npmjs.com/package/${name}`,
      },
      {
        filePath: './.npmignore',
        badgeName: 'npm-size',
        image: `https://img.shields.io/bundlephobia/minzip/${name}.svg`,
      },
      {
        filePath: './.npmignore',
        badgeName: 'github-size',
        image: `https://img.shields.io/github/repo-size/${repoInfo}.svg`,

        /**
         * @param {boolean} result - use function or not
         *
         * @return {boolean} - the result of the checking
         */
        filterFunc: (result: boolean) => !result,
      },
      ...Object.keys(engines).map((key: string) => ({
        filePath: './package.json',
        badgeName: `engine-${key}`,
        image: `https://img.shields.io/badge/${key}-${encodeURI(
          engines[key],
        )}-green.svg`,
        filterFunc: emptyFunction.thatReturnsTrue,
      })),
      {
        filePath: './LICENSE',
        badgeName: 'license',
        image: `https://img.shields.io/github/license/${repoInfo}.svg`,
        link: `./LICENSE`,
      },
      {
        filePath: './node_modules/.bin/lerna',
        badgeName: 'lerna',
        image:
          'https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg',
        link: 'https://lernajs.io',
      },
      {
        filePath: './.git',
        badgeName: 'git-search-todo',
        image: `https://img.shields.io/github/search/${repoInfo}/todo+-language:markdown?label=todo`,
        link: `https://github.com/${repoInfo}/search?q=todo+-language:markdown&unscoped_q=todo+-language:markdown`,
      },
    ].filter(
      ({
        filePath,
        filterFunc = emptyFunction.thatReturnsArgument,
      }: badgeType) =>
        filterFunc(fs.existsSync(path.resolve(rootPath, filePath))),
    ),
  );

  return readme.replace(
    new RegExp(`${START_COMMENT}(.|\n)*${END_COMMENT}`, 'g'),
    `${START_COMMENT}${badges}${END_COMMENT}`,
  );
};
