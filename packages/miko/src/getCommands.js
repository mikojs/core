import stringArgv from 'string-argv';

const commandsToString = commands =>
  commands
    .map(command =>
      command
        .map(key => {
          if (!/ /.test(key) || /^['"]/.test(key)) return key;

          return key.match(/['"]/)?.[0] === '"' ? `'${key}'` : `"${key}"`;
        })
        .join(' '),
    )
    .join(' && ');

const addNode = command =>
  command[0] === 'miko' ? ['node', ...command] : ['node', 'miko', ...command];

const getCommands = async (argv, parseArgv) =>
  (await parseArgv(argv)).reduce(async (promiseResult, key, index, keys) => {
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
                    ...(await getCommands(
                      ['node', ...stringArgv(subKey)],
                      parseArgv,
                    )),
                  ],
                  Promise.resolve([]),
                ),
            ),
      );

    return [
      ...result.slice(0, -1),
      ...(command[0] !== 'miko' || (key !== '&&' && keys.length - 1 !== index)
        ? [command]
        : await getCommands(
            addNode(await parseArgv(['node', ...command])),
            parseArgv,
          )),
      ...(key === '&&' ? [[]] : []),
    ];
  }, Promise.resolve([[]]));

export default getCommands;
