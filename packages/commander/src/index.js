// @flow

import commander from 'commander';

type commandOptionType = {|
  flags: string,
  description: string,
|};

type configType = {|
  description: string,
  options?: $ReadOnlyArray<commandOptionType>,
  commands?: {|
    [string]: configType,
  |},
|};

type optionType = configType & {|
  name: string,
  version: string,
|};

type callbackType<O> = (option: O) => void;

/**
 * @param {commander} prevProgram - prev program object
 * @param {configType} config - program config
 * @param {callbackType} callback - callback function
 */
const addConfig = <O>(
  prevProgram: typeof commander,
  { description, options = [], commands = {} }: configType,
  callback: callbackType<O>,
) => {
  const program = options
    .reduce(
      (
        result: typeof commander,
        { flags, description: desc }: commandOptionType,
      ) => result.option(flags, desc),
      prevProgram.description(description),
    )
    .action(callback);

  Object.keys(commands).forEach((key: string) => {
    addConfig(program.command(key), commands[key], callback);
  });
};

/**
 * @param {configType} config - commander config
 *
 * @return {Promise} - parse result
 */
export default <O>({
  name,
  version,
  ...config
}: optionType): ((argv: $ReadOnlyArray<string>) => Promise<O>) => (
  argv: $ReadOnlyArray<string>,
) =>
  new Promise(resolve => {
    const program = new commander.Command(name).version(version);

    addConfig(program, config, resolve);
    program.parse(argv);
  });
