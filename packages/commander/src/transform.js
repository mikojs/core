export default config =>
  [
    'version',
    'description',
    'arguments',
    'allowUnknownOption',
    'exitOverride',
    'options',
    'requiredOptions',
    'action',
  ].reduce((result, key) => {
    const value = config[key];

    if (!value) return result;

    if (['options', 'requiredOptions'].includes(key))
      return [
        ...result,
        ...value.map(({ flags, description }) => [
          key.replace(/s$/, ''),
          flags,
          description,
        ]),
      ];

    return [
      ...result,
      ...({
        version: [
          ['version', value, '-v --version', 'Output the version number.'],
        ],
        description: [
          ['description', value],
          ['helpOption', '-h, --help', 'Display help for command.'],
        ],
        arguments: [['arguments', value]],
        action: [['action', value]],
      }[key] || [[key]]),
    ];
  }, []);
