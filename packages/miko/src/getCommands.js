import stringArgv from 'string-argv';

const getCommands = (commandStr, parseArgv) => stringArgv(commandStr);

export default getCommands;
