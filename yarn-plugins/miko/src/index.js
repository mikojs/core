import { BaseCommand as Command } from '@yarnpkg/cli';

import loadConfigs from './utils/loadConfigs';
import normalize from './utils/normalize';

export default {
  commands: normalize(loadConfigs(process.cwd())).map(
    ([command]) =>
      class MikoCommand extends Command {
        static paths = [command];

        execute = () => {
          // TODO console.log(script);
        };
      },
  ),
};
