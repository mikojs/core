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
        execute = async () => {
          const { run } = this.cli;
          const commandArgv = stringArgv(
            typeof command === 'string' ? command : await command(),
          );
          const { exitCode: finalExitCode } = await [
            ...commandArgv,
            ...this.args,
            '&&',
          ].reduce(
            async (promiseResult, str) => {
              const { argv, exitCode } = await promiseResult;

              if (exitCode !== 0) return { argv, exitCode };

              return str === '&&'
                ? {
                    argv: [],
                    exitCode: await run(argv),
                  }
                : {
                    argv: [...argv, str],
                    exitCode,
                  };
            },
            Promise.resolve({
              argv: [],
              exitCode: 0,
            }),
          );

          return finalExitCode;
        };
      },
      ...getCommands(commands, [...prevKey, key]),
    ];
  }, []);

export default {
  commands: getCommands(cosmiconfigSync('miko').search()?.config || {}, [
    'miko-todo',
  ]),
};
