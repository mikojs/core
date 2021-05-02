import { BaseCommand as Command } from '@yarnpkg/cli';
import { cosmiconfigSync } from 'cosmiconfig';

const getCommands = (config, prevKey = []) =>
  Object.keys(config).reduce((result, key) => {
    const { commands = {}, ...usage } = config[key];

    return [
      ...result,
      class CustomCommand extends Command {
        static usage = Command.Usage({
          ...usage,
          category: 'Miko-related commands',
        });

        @Command.Path(...prevKey, key)
        execute = () => {
          const { stdout } = this.context;

          // TODO
          stdout.write(JSON.stringify(config[key]));
          stdout.write('\n');
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
