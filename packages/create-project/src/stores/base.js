// @flow

import pkg from './pkg';
import gitignore from './gitignore';
import flow from './flow';
import npmignore from './npmignore';
import Store from './index';

/** base store */
class Base extends Store {
  subStores = [pkg, gitignore, flow, npmignore];
}

export default new Base();
