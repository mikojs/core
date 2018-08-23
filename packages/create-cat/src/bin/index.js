#! /usr/bin/env node
// @flow

import { invariant } from 'fbjs';

import getSettings from 'utils/getSettings';

import findFile from 'middleware/findFile';
import compareFile from 'middleware/compareFile';
import writeFile from 'middleware/writeFile';

process.on('unhandledRejection', error => {
  throw error;
});

(async () => {
  const settings = await getSettings();

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
      await require(handlerPath)(node);
    } catch (e) {
      if (/Cannot find module/.test(e.message))
        throw new Error(`can not find \`${name}\` handler`);
      else throw e;
    }

    await compareFile(node);

    writeFile(node);
  }
})();
