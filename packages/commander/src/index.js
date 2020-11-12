// @flow

import commander from 'commander';

type commandOptionsType = {|
  flags: string,
  description: string,
|};

type configsType = {|
  description: string,
  args?: string,
  allowUnknownOption?: boolean,
  exitOverride?: boolean,
  options?: $ReadOnlyArray<commandOptionsType>,
  commands?: {|
    [string]: configsType,
  |},
|};

export type optionsType = {|
  ...configsType,
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
 * @param {configsType} config - program config
 * @param {callbackType} callback - callback function
 */
const addConfig = <Data: $ReadOnlyArray<mixed>>(
  prevProgram: typeof commander,
  {
    description,
    args,
    allowUnknownOption,
    exitOverride,
    options = [],
    commands = {},
  }: configsType,
  callback: callbackType<Data>,
) => {
  const program = [...defaultOptions, ...options]
    .reduce(
      (
        result: typeof commander,
        { flags, description: desc }: commandOptionsType,
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
        }[flags]?.() || result.option(flags, desc)),
      prevProgram.description(description),
    )
    .action((...data: Data) => callback(data));

  Object.keys(commands).forEach((key: string) => {
    addConfig(program.command(key), commands[key], (data: Data) =>
      callback([key, ...data]),
    );
  });
};

/**
 * @param {configsType} config - commander config
 *
 * @return {Promise} - parse result
 */
export default <Data: $ReadOnlyArray<mixed>>({
  name,
  version,
  ...config
}: optionsType): ((argv: $ReadOnlyArray<string>) => Promise<Data>) => (
  argv: $ReadOnlyArray<string>,
) =>
  new Promise(resolve => {
    const program = new commander.Command(name).version(
      version,
      '-v --version',
    );

    addConfig(program, config, resolve);
    program.parse(argv);
  });
