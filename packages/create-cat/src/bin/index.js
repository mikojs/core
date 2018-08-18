#! /usr/bin/env node
// @flow

import { invariant } from 'fbjs';

import getSettings from 'utils/getSettings';

import findFile from 'middleware/findFile';
import compareFile from 'middleware/compareFile';
import writeFile from 'middleware/writeFile';

import config from '../config';

process.on('unhandledRejection', error => {
  throw error;
});

(async () => {
  const settings = getSettings(config);

  for (const index in settings) {
    const node = settings[index];

    findFile(node);

    const {
      data: { name, relativeFilePath },
    } = node;
    const handlerPath = relativeFilePath
      .replace(/^\.\/[.]?/, '../handlers/')
      .replace(/.json$/, '');

    try {
      require(handlerPath)(node);
    } catch (e) {
      // TODO throw new Error(`can not find \`${name}\` handler`);
    }

    await compareFile(node);

    writeFile(node);
  }
})();
