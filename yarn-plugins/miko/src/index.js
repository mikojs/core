import { BaseCommand as Command } from '@yarnpkg/cli';
import stringArgv from 'string-argv';

import loadConfig from './utils/loadConfig';

const getCommands = (config, prevKey = []) =>
  Object.keys(config).reduce((result, key) => {
    const { command, commands = {}, ...usage } = config[key];

    return [
      ...result,
      class CustomCommand extends Command {
        static usage = Command.Usage({
          ...usage,
          category: 'Miko-related commands',
        });

        @Command.Proxy()
        args = [];

        @Command.Path(...prevKey, key)
        execute = async () =>
          this.cli.run([
            ...stringArgv(
              typeof command === 'string' ? command : await command(),
            ),
            ...this.args,
          ]);
      },
      ...getCommands(commands, [...prevKey, key]),
    ];
  }, []);

export default {
  commands: getCommands(loadConfig()),
};
