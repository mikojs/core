import loadConfigs from './utils/loadConfigs';
import buildCommands from './utils/buildCommands';
import normalize from './utils/normalize';

export default {
  commands: buildCommands(normalize(loadConfigs(process.cwd()))),
};
