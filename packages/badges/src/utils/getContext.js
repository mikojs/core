// @flow

import path from 'path';

import execa from 'execa';
import chalk from 'chalk';
import readPkgUp from 'read-pkg-up';

import { type ctxType } from './badges';

/**
 * @param {string} cwd - cwd path
 *
 * @return {ctxType} - context value
 */
const getRepoInfo = async (
  cwd: string,
): Promise<{|
  repoInfo: $PropertyType<ctxType, 'repoInfo'>,
|}> => {
  try {
    const { stdout } = await execa('git', ['remote', '-v'], {
      cwd,
    });

    return {
      repoInfo: stdout.replace(/origin\t.*@.*:(.*).git \(fetch\)(.|\n)*/, '$1'),
    };
  } catch (e) {
    throw new Error(chalk`Could not find {green git remote}.`);
  }
};

/**
 * @param {string} cwd - cwd path
 *
 * @return {ctxType} - context value
 */
const getPkg = async (
  cwd: string,
): Promise<$Diff<ctxType, {| repoInfo: mixed |}>> => {
  const { path: pkgPath, packageJson: pkg } =
    (await readPkgUp({
      cwd,
    })) || {};

  if (!pkgPath) throw new Error('Could not find the root path.');

  return {
    ...pkg,
    rootPath: path.dirname(pkgPath),
  };
};

/**
 * @param {string} cwd - cwd path
 *
 * @return {ctxType} - context value
 */
export default async (cwd: string): Promise<ctxType> => ({
  ...(await getRepoInfo(cwd)),
  ...(await getPkg(cwd)),
});
