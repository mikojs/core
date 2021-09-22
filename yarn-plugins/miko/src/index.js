import { BaseCommand as Command } from '@yarnpkg/cli';

import scripts from './scripts';

export default {
  commands: scripts.map(
    ([key, tasks]) =>
      class MikoCommand extends Command {
        static paths = [key.split(/\./g)];

        execute = () => {
          console.log(tasks);
        };
      },
  ),
};
