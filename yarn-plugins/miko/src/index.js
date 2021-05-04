import { execUtils } from '@yarnpkg/core';
import { BaseCommand as Command } from '@yarnpkg/cli';
import stringArgv from 'string-argv';
import { cosmiconfigSync } from 'cosmiconfig';

import stdoutInterceptor from './utils/stdoutInterceptor';

const getCommands = (config, prevKey) =>
  Object.keys(config).reduce((result, key) => {
    const { command, commands = {}, ...usage } = config[key];

    return [
      ...result,
      class CustomCommand extends Command {
        static usage = Command.Usage({
          ...usage,
          category: 'Miko-related commands',
        });

        @Command.Proxy()
        args = [];

        @Command.Path(...prevKey, key)
        execute = async () => {
          const { run } = this.cli;
          const { cwd, stdin, stdout: originalStdout, stderr } = this.context;
          const stdout = stdoutInterceptor(originalStdout);
          const commandArgv = stringArgv(
            typeof command === 'string' ? command : await command(),
          );
          const { exitCode: finalExitCode } = await [
            ...commandArgv,
            ...this.args,
            '&&',
          ].reduce(
            async (promiseResult, str) => {
              const { argv, exitCode } = await promiseResult;

              if (exitCode !== 0) return { argv, exitCode };

              if (str !== '&&')
                return {
                  argv: [...argv, str],
                  exitCode,
                };

              try {
                return {
                  argv: [],
                  exitCode:
                    (await run(argv)) === 0
                      ? 0
                      : await execUtils
                          .pipevp(argv[0], argv.slice(1), {
                            cwd,
                            stdin,
                            stdout,
                            stderr,
                          })
                          .then(({ code }) => code),
                };
              } catch (e) {
                stdout.write.stdoutInterceptor.end();

                return {
                  argv: [],
                  exitCode: 1,
                };
              }
            },
            Promise.resolve({
              argv: [],
              exitCode: 0,
            }),
          );

          return finalExitCode;
        };
      },
      ...getCommands(commands, [...prevKey, key]),
    ];
  }, []);

export default {
  commands: getCommands(cosmiconfigSync('miko').search()?.config || {}, [
    'miko-todo',
  ]),
};
