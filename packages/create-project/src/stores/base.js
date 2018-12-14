// @flow

import pkg from './pkg';
import gitignore from './gitignore';
import npmignore from './npmignore';
import configs from './configs';
import flow from './flow';
import Store from './index';

/** base store */
class Base extends Store {
  subStores = [pkg, gitignore, npmignore, configs, flow];
}

export default new Base();
