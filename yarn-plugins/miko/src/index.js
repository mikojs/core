import { BaseCommand as Command } from '@yarnpkg/cli';
import stringArgv from 'string-argv';
import { cosmiconfigSync } from 'cosmiconfig';

import runCommand from './utils/runCommand';
import addInterceptor from './utils/addInterceptor';
import exec from './utils/exec';
import runAll from './utils/runAll';

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
          const { cwd, stdin, stdout, stderr } = this.context;

          addInterceptor(stdout);

          const { exitCode } = await runCommand(
            [
              ...stringArgv(
                typeof command === 'string' ? command : await command(),
              ),
              ...this.args,
              '&&',
            ],
            argv => runAll(argv, { cwd, stdin, stdout, stderr }, run, exec),
          );

          return exitCode;
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
