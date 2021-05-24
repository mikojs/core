import { execUtils } from '@yarnpkg/core';
import { BaseCommand as Command } from '@yarnpkg/cli';
import stringArgv from 'string-argv';

import loadPlugin from './utils/loadPlugin';
import commandsReducer from './utils/commandsReducer';

const getCommands = (config, prevKey = []) =>
  Object.keys(config).reduce((result, key) => {
    const { command, commands = {}, ...usage } = config[key];

    return [
      ...result,
      class CustomCommand extends Command {
        static usage = Command.Usage({
          ...usage,
          category: 'Alias-related commands',
        });

        @Command.Proxy()
        args = [];

        @Command.Path(...prevKey, key)
        execute = async () => {
          const { cwd, stdin, stdout, stderr } = this.context;
          const { run } = this.cli;
          const exitCode = await commandsReducer([
            ...stringArgv(
              typeof command === 'string' ? command : await command(),
            ),
            ...this.args,
            '&&',
          ], ([command, ...argv]) =>
            command === 'yarn'
              ? run(argv)
              : execUtils.pipevp(command, argv, {
                cwd,
                stdin, stdout, stderr,
              }).then(({ code }) => code),
          );

          return exitCode;
        };
      },
      ...getCommands(commands, [...prevKey, key]),
    ];
  }, []);

export default {
  commands: getCommands(loadPlugin()),
};
