import stringArgv from 'string-argv';

import getCommandStr from './getCommandStr';

const getCommands = (commandStr, parseArgv) =>
  stringArgv(commandStr).reduce(async (subResult, key, index, allKeys) => {
    const result = await subResult;
    const newCommand = [
      ...result.slice(-1)[0],
      ...(key === '&&'
        ? []
        : [
            key === 'miko' || !/miko/.test(key)
              ? key
              : (await getCommands(key, parseArgv))
                  .map(getCommandStr)
                  .join(' && '),
          ]),
    ];

    return [
      ...result.slice(0, -1),
      ...(newCommand[0] !== 'miko' ||
      (key !== '&&' && allKeys.length - 1 !== index)
        ? [newCommand]
        : await getCommands(
            await parseArgv(['node', ...newCommand]),
            parseArgv,
          )),
      ...(key === '&&' ? [[]] : []),
    ];
  }, Promise.resolve([[]]));

export default getCommands;
