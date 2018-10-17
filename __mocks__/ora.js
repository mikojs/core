// @flow

/**
 * @example
 * ora()
 *
 * @return {Object} - mock ora
 */
const ora = () =>
  ['start', 'succeed', 'fail', 'warn', 'info'].reduce(
    (
      result: {},
      key: string,
    ): {
      isSpinning?: boolean,
    } => ({
      ...result,
      [key]: (message: string): {} => {
        const { log } = console;
        const newOra = ora();

        log(message);

        if (/isSpinning/.test(message)) newOra.isSpinning = true;

        return newOra;
      },
    }),
    {},
  );

export default ora;
