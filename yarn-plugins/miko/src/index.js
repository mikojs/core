import { BaseCommand as Command } from '@yarnpkg/cli';

import load from './utils/load';
import normalize from './utils/normalize';

export default {
  commands: normalize(load(process.cwd())).map(
    ([command]) =>
      class MikoCommand extends Command {
        static paths = [command];

        execute = () => {
          // TODO console.log(script);
        };
      },
  ),
};
