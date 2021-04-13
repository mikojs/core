#! /usr/bin/env node

import execa from 'execa';
import { cosmiconfigSync } from 'cosmiconfig';

import getParseArgv from '../getParseArgv';
import getCommands from '../getCommands';
import spliceEnv from '../spliceEnv';

(async () => {
  const commands = await getCommands(
    ['miko', ...process.argv.slice(2)],
    getParseArgv({
      commands: cosmiconfigSync('miko').search()?.config,
    }),
  );

  try {
    const globalEnv = {};

    await commands.reduce(async (result, command) => {
      await result;

      const { env, argv } = spliceEnv(command);
      const localEnv = {};

      env.forEach(key => {
        const [envKey, envValue] = key.split(/=/);

        if (argv.length === 0) globalEnv[envKey] = envValue;
        else localEnv[envKey] = envValue;
      });

      if (argv.length !== 0)
        await execa(argv[0], argv.slice(1), {
          stdio: 'inherit',
          env: {
            ...globalEnv,
            ...localEnv,
          },
        });
    }, Promise.resolve());
  } catch (e) {
    process.exit(1);
  }
})();
