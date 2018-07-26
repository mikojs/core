import { transformFile } from '@babel/core';
import outputFileSync from 'output-file-sync';

import utils from './utils';

class WriteFiles {
  store = [];

  isWritting = false;

  add = file => {
    this.store.push(file);

    if (!this.isWritting) this.writeFiles();
  };

  writeFiles = () => {
    this.isWritting = true;

    const { verbose, watch } = utils.options;
    const { srcPath, destPath, babelConfigs } = this.store.pop();

    new Promise((resolve, reject) => {
      transformFile(srcPath, babelConfigs, (err, { code }) => {
        if (err)
          return reject(`@cat-org/babel-plugin-transform-flow Error: ${err}`);

        outputFileSync(destPath, code);
      });

      this.store = this.store.filter(({ srcPath: src }) => src !== srcPath);
      this.isWritting = false;

      return resolve();
    })
      .then(() => {
        if (verbose) console.log(`${srcPath} -> ${destPath}`);
        if (this.store.length !== 0) this.writeFiles();
      })
      .catch(e => {
        if (watch) console.log(e);
        else throw new Error(e);
      });
  };
}

export default new WriteFiles();
