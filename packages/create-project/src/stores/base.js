// @flow

import pkg from './pkg';
import gitignore from './gitignore';
import flowconfig from './flowconfig';
import npmignore from './npmignore';
import Store from './index';

/** base store */
class Base extends Store {
  subStores = [pkg, gitignore, flowconfig, npmignore];
}

export default new Base();
