import stringArgv from 'string-argv';

import commandsToString from './commandsToString';
import spliceEnv from './spliceEnv';

const getCommands = async (originalArgv, parseArgv) => {
  const { env, argv } = spliceEnv(originalArgv);

  return argv[0] !== 'miko'
    ? [originalArgv]
    : [...env, ...(await parseArgv(['node', ...argv]))].reduce(
        async (promiseResult, key, index, keys) => {
          const result = await promiseResult;
          const [command] = result.slice(-1);

          if (key !== '&&')
            command.push(
              key === 'miko' || !/miko/.test(key)
                ? key
                : commandsToString(
                    await key
                      .split(/[ ]+&&[ ]+/)
                      .reduce(
                        async (promiseSubResult, subKey) => [
                          ...(await promiseSubResult),
                          ...(await getCommands(stringArgv(subKey), parseArgv)),
                        ],
                        Promise.resolve([]),
                      ),
                  ),
            );

          return [
            ...result.slice(0, -1),
            ...((key !== '&&' && keys.length - 1 !== index) ||
            spliceEnv(command).argv[0] !== 'miko'
              ? [command]
              : await getCommands(command, parseArgv)),
            ...(key === '&&' ? [[]] : []),
          ];
        },
        Promise.resolve([[]]),
      );
};

export default getCommands;
