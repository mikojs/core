import { BaseCommand as Command } from '@yarnpkg/cli';

import scripts from './scripts';

export default {
  commands: scripts.map(([key, commands]) => class MikoCommand extends Command {
    static paths = [key.split(/\./g)];

    execute = () => {
      console.log(commands);
    };
  })
};
