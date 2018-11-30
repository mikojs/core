// @flow

import util from 'util';
import path from 'path';

import debug from 'debug';
import npmWhich from 'npm-which';
import chalk from 'chalk';

import Cache from './index';

import logger from 'utils/logger';

const debugLog = debug('create-app:cache:constants');

/** constants cache */
class Constants extends Cache<{
  useLerna: boolean,
}> {
  store = {
    useLerna: false,
  };

  /**
   * @example
   * constants.init()
   *
   * @param {string} projectDir - project dir path
   */
  init = async (projectDir: string): Promise<void> => {
    const which = util.promisify(npmWhich(projectDir));

    await which('lerna')
      .then((filePath: string) => {
        const rootPath = path.resolve(filePath, '../../..');
        const { workspaces } = require(path.resolve(
          rootPath,
          './package.json',
        ));
        const projectFolderCorrect = workspaces.reduce(
          (result: false, workspace: string) =>
            result ||
            path.resolve(
              rootPath,
              workspace.replace(/\*/, path.basename(projectDir)),
            ) === projectDir,
          false,
        );

        logger.info(
          chalk`Detect {cyan lerna} in {green ${projectDir}}`,
          chalk`Use {cyan lerna} mode`,
        );

        if (!projectFolderCorrect)
          logger.fail(
            chalk`{green ${projectDir}} is not under workspaces: {cyan ["${workspaces.join(
              '", "',
            )}"]}`,
          );

        this.store.useLerna = true;
      })
      .catch(({ message }: { message: string }) => {
        debugLog(message);
        this.store.useLerna = false;
      });
  };
}

export default new Constants();
