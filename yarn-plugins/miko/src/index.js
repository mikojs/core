import loadConfig from './utils/loadConfig';

const getCommands = () => ({});

export default {
  commands: getCommands(loadConfig()),
};
