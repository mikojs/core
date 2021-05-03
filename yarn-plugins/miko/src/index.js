import { BaseCommand as Command } from '@yarnpkg/cli';
import stringArgv from 'string-argv';
import { cosmiconfigSync } from 'cosmiconfig';

const getCommands = (config, prevKey) =>
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
          [
            ...stringArgv(
              typeof command === 'string' ? command : await command(),
            ),
            ...this.args,
            '&&',
          ].reduce(
            async (promiseResult, value) => {
              const result = await promiseResult;
              const { run } = this.cli;

              if (result.skip) return result;

              return value === '&&'
                ? {
                    skip: (await run(result.command)) !== 0,
                    command: [],
                  }
                : {
                    ...result,
                    command: [...result.command, value],
                  };
            },
            Promise.resolve({
              command: [],
              skip: false,
            }),
          );
      },
      ...getCommands(commands, [...prevKey, key]),
    ];
  }, []);

export default {
  commands: getCommands(cosmiconfigSync('miko').search()?.config || {}, [
    'miko-todo',
  ]),
};
