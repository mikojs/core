// @flow

import pkg from './pkg';
import Store from './index';

/** base store */
class Base extends Store {
  subStores = [pkg];
}

export default new Base();
