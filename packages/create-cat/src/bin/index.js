#! /usr/bin/env node
// @flow

import { invariant } from 'fbjs';

import getSettings from 'utils/getSettings';
import handlers from 'handlers';

import findFile from 'middleware/findFile';
import compareFile from 'middleware/compareFile';

import config from '../config';

const settings = getSettings(config);

(async () => {
  for (const index in settings) {
    const node = settings[index];

    findFile(node);

    const {
      data: { name, relativeFilePath },
    } = node;
    const handler = handlers(relativeFilePath);

    invariant(handler, `can not find \`${name}\` handler`);
    handler(node);

    await compareFile(node);
  }
})();
