#! /usr/bin/env node
// @flow

import fs from 'fs';

import createServer from 'utils/createServer';

(() => {
  const port = parseInt(process.argv[2], 10);

  if (!process.env.CONFIG_SERVER_DEBUG) {
    createServer(port);
    return;
  }

  const output = fs.createWriteStream('config-server-debug');

  createServer(
    port,
    (data: string) => {
      output.write(data);
    },
    () => {
      output.close();
    },
  );
})();
