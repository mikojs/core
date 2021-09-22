import invariant from 'fbjs/lib/invariant';

const aliasToTasks = alias =>
  Object.keys(alias).reduce((result, key) => {
    const task =
      typeof alias[key] !== 'string' ? alias[key] : { command: alias[key] };

    [
      [!(task instanceof Array), `\`config.alias.${key}\` can\`t be an array.`],
      [task.command, `\`config.alias.${key}.command\` is required.`],
    ].forEach(invariantArgv => {
      invariant(...invariantArgv);
    });

    return {
      ...result,
      [key]: task,
    };
  }, {});

const normalizeScripts = (scripts, tasks) =>
  Object.keys(scripts).reduce(
    (result, key) => [
      ...result,
      [
        key,
        (scripts[key] instanceof Array ? scripts[key] : [scripts[key]]).map(
          taskStrOrObj => {
            if (typeof taskStrOrObj === 'string') return tasks[taskStrOrObj];

            const { command, ...task } = taskStrOrObj;

            return {
              ...(command in tasks ? tasks[command] : { command }),
              ...task,
            };
          },
        ),
      ],
    ],
    [],
  );

export default ({ alias = {}, scripts = {} }) =>
  normalizeScripts(scripts, aliasToTasks(alias));
