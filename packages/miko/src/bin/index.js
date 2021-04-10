#! /usr/bin/env node

import execa from 'execa';
import { cosmiconfigSync } from 'cosmiconfig';

import getParseArgv from '../getParseArgv';
import getCommands from '../getCommands';

(async () => {
  const commands = await getCommands(
    process.argv,
    getParseArgv({
      commands: cosmiconfigSync('miko').search()?.config,
    }),
  );

  try {
    await commands.reduce(async (result, command) => {
      await result;
      await execa(command[0], command.slice(1), {
        stdio: 'inherit',
      });
    }, Promise.resolve());
  } catch (e) {
    process.exit(1);
  }
})();
