// @flow

import commander from 'commander';

type commandOptionsType = {|
  flags: string,
  description: string,
|};

export type defaultOptionsType<C = {||}> = {|
  ...C,
  description: string,
  args?: string,
  allowUnknownOption?: boolean,
  exitOverride?: boolean,
  options?: $ReadOnlyArray<commandOptionsType>,
  requiredOptions?: $ReadOnlyArray<commandOptionsType>,
  commands?: {|
    [string]: defaultOptionsType<C>,
  |},
|};

export type optionsType<C = {||}> = {|
  ...defaultOptionsType<C>,
  name: string,
  version: string,
|};

type callbackType<Data: $ReadOnlyArray<mixed>> = (data: Data) => void;

const defaultOptions = ['args', 'allowUnknownOption', 'exitOverride'].map(
  (key: string) => ({
    flags: key,
    description: key,
  }),
);

/**
 * @param {commander} prevProgram - prev program object
 * @param {defaultOptionsType} config - program config
 * @param {callbackType} callback - callback function
 */
const addConfig = <Data: $ReadOnlyArray<mixed>, C = {||}>(
  prevProgram: typeof commander,
  config: defaultOptionsType<C>,
  callback: callbackType<Data>,
) => {
  const {
    description,
    args,
    allowUnknownOption,
    exitOverride,
    options = [],
    requiredOptions = [],
    commands = {},
  } = config;
  const program = [...defaultOptions, ...requiredOptions, ...options]
    .reduce(
      (
        result: typeof commander,
        { flags, description: desc }: commandOptionsType,
        index: number,
      ) =>
        ({
          /**
           * @return {commander} - new program
           */
          args: () => (!args ? result : result.arguments(args)),

          /**
           * @return {commander} - new program
           */
          allowUnknownOption: () =>
            !allowUnknownOption ? result : result.allowUnknownOption(),

          /**
           * @return {commander} - new program
           */
          exitOverride: () => (!exitOverride ? result : result.exitOverride()),
        }[flags]?.() ||
        (index >= defaultOptions.length + requiredOptions.length
          ? result.option(flags, desc)
          : result.requiredOption(flags, desc))),
      prevProgram
        .description(description)
        .helpOption('-h, --help', 'Display help for command.'),
    )
    .action((...data: Data) => callback(data));

  program.miko = config;
  Object.keys(commands).forEach((key: string) => {
    addConfig<Data, C>(program.command(key), commands[key], (data: Data) =>
      // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8458
      callback([key, ...data]),
    );
  });
};

/**
 * @param {defaultOptionsType} config - commander config
 *
 * @return {Promise} - parse result
 */
export default <Data: $ReadOnlyArray<mixed>, C = {||}>({
  name,
  version,
  ...config
}: optionsType<C>): ((argv: $ReadOnlyArray<string>) => Promise<Data>) => (
  argv: $ReadOnlyArray<string>,
) =>
  new Promise(resolve => {
    const program = new commander.Command(name).version(
      version,
      '-v --version',
      'Output the version number.',
    );

    addConfig<Data, C>(program, config, resolve);
    program.parse(argv);
  });
