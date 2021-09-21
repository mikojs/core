import { BaseCommand as Command } from '@yarnpkg/cli';

export default configs =>
  Object.keys(configs)
    .reduce((result, key) => [
      ...result,
      class MikoCommand extends Command {
        @Command.Path(...key.split(/\./))
        execute = () => {
          // TODO console.log(configs[key]);
        }
      }
    ], {});
