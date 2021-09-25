export default scripts =>
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
