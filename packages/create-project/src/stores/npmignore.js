// @flow

import inquirer from 'inquirer';
import memoizeOne from 'memoize-one';
import debug from 'debug';

import Store from './index';

import normalizedQuestions from 'utils/normalizedQuestions';

const debugLog = debug('create-project:store:npmignore');

export const template = `# default
*.log

# node
node_modules

# babel
src

# eslint
.eslintcache

# flow
.flowignore
flow-typed

# jest
coverage
__tests__
__mocks__

# circleci
.circleci`;

export const NPMIGNORE_QUESTIONS = [
  {
    name: 'useNpm',
    message: 'use npm or not',
    type: 'confirm',
    default: false,
  },
];

/** npmignore store */
class Npmignore extends Store {
  storeUseNpm = false;

  /**
   * @example
   * npmignore.checkNpm()
   */
  checkNpm = memoizeOne(
    async (): Promise<void> => {
      this.storeUseNpm = (await inquirer.prompt(
        normalizedQuestions<string>(...NPMIGNORE_QUESTIONS),
      )).useNpm;
      debugLog(this.storeUseNpm);
    },
  );

  /**
   * @example
   * npmignore.store()
   */
  start = async (): Promise<void> => {
    await this.checkNpm();
  };

  /**
   * @example
   * npmignore.end()
   */
  end = () => {
    if (this.storeUseNpm)
      this.writeFiles({
        '.npmignore': template,
      });
  };
}

export default new Npmignore();
