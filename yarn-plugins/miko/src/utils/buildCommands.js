import { BaseCommand as Command } from '@yarnpkg/cli';

export default configs =>
  Object.keys(configs)
    .reduce((result, key) => [
      ...result,
      class MikoCommand extends Command {
        static paths = [key.split(/\./g)];

        execute = () => {
          // TODO console.log(configs[key]);
        }
      }
    ], []);
