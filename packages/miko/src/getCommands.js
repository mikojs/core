import stringArgv from 'string-argv';

const getCommands = (commandStr, parseArgv) =>
  stringArgv(commandStr).reduce(async (subResult, key, index, allKeys) => {
    const result = await subResult;
    const command = [...result.slice(-1)[0], ...(key === '&&' ? [] : [key])];

    return [
      ...result.slice(0, -1),
      ...(command[0] !== 'miko' ||
      (key !== '&&' && allKeys.length - 1 !== index)
        ? [command]
        : await getCommands(await parseArgv(['node', ...command]), parseArgv)),
      ...(key === '&&' ? [[]] : []),
    ];
  }, Promise.resolve([[]]));

export default getCommands;
