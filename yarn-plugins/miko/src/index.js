import { BaseCommand as Command } from '@yarnpkg/cli';

import configs from './configs';

export default {
  commands: configs.map(([key]) => class MikoCommand extends Command {
    static paths = [key.split(/\./g)];

    execute = () => {
      // TODO console.log(config);
    };
  })
};
