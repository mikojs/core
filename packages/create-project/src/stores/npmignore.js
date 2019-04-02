// @flow

import memoizeOne from 'memoize-one';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

import readme from './readme';
import circleci from './circleci';
import Store from './index';

import normalizedQuestions from 'utils/normalizedQuestions';

const debugLog = debug('create-project:store:npmignore');

const template = `# default
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

const NPMIGNORE_QUESTIONS = [
  {
    name: 'useNpm',
    message: 'use npm or not',
    type: 'confirm',
    default: false,
  },
];

/** npmignore store */
class Npmignore extends Store {
  subStores = [readme, circleci];

  storeUseNpm = false;

  /**
   * @example
   * npmignore.checkNpm()
   */
  checkNpm = memoizeOne(async () => {
    this.storeUseNpm = (await this.prompt(
      normalizedQuestions<boolean>(...NPMIGNORE_QUESTIONS),
    )).useNpm;
    debugLog(this.storeUseNpm);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * npmignore.store(ctx)
   *
   * @param {Object} ctx - store context
   */
  start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkNpm();

    ctx.useNpm = this.storeUseNpm;
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
