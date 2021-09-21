import loadConfigs from './utils/loadConfigs';
import buildCommands from './utils/buildCommands';

export default {
  commands: process.cwd()
    |> loadConfigs(%)
    |> buildCommands(%)
};
