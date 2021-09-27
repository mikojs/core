import { BaseCommand as Command } from '@yarnpkg/cli';

import load from './utils/load';
import normalize from './utils/normalize';

export default {
  commands: normalize(load(process.cwd())).map(
    ([command, scripts]) =>
      class MikoCommand extends Command {
        static paths = [[command]];

        static usage = Command.Usage({
          category: 'Miko-related commands',
          // TODO: add output function
          description: `run \`${scripts[0].script}\``,
        });

        execute = () => {
          // TODO console.log(scripts);
        };
      },
  ),
};
