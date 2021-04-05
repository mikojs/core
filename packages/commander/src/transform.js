const CONFIG_KEYS = [
  'version',
  'description',
  'arguments',
  'allowUnknownOption',
  'exitOverride',
  'options',
  'requiredOptions',
];

export default config =>
  CONFIG_KEYS.reduce((result, key) => {
    const value = config[key];

    if (!value) return result;

    switch (key) {
      case 'options':
        return [
          ...result,
          ...value.map(({ flags, description }) => [
            'option',
            flags,
            description,
          ]),
        ];

      case 'requiredOptions':
        return [
          ...result,
          ...value.map(({ flags, description }) => [
            'requiredOption',
            flags,
            description,
          ]),
        ];

      default:
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
          }[key] || [[key]]),
        ];
    }
  }, []);
