// @flow

import fs from 'fs';
import path from 'path';

import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';

class StoreCache {
  cacheDir = findCacheDir({ name: 'create-cat' });

  getCachePath = name => path.resolve(this.cacheDir, `${name}.json`);

  set = (name, data) => {
    outputFileSync(this.getCachePath(name), JSON.stringify(data, null, 2));
  };

  get = name => {
    const cachePath = this.getCachePath(name);

    return fs.existsSync(cachePath) ? require(cachePath) : null;
  };
}

export default new StoreCache();
