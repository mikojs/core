// @flow

import memoizeOne from 'memoize-one';
import envinfo from 'envinfo';
import { emptyFunction } from 'fbjs';

/**
 * @example
 * getEngines()
 *
 * @return {Promise} - engines info
 */
export const getEngines = async (): Promise<{
  [string]: string,
}> => {
  const { Binaries } = JSON.parse(
    await envinfo.run(
      {
        Binaries: ['Node', 'Yarn', 'npm'],
      },
      { json: true },
    ),
  );

  return Object.keys(Binaries)
    .filter((key: string) => Binaries[key])
    .reduce(
      (result: {}, key: string) => ({
        ...result,
        [key.toLowerCase()]: `>= ${Binaries[key].version}`,
      }),
      {},
    );
};

export default memoizeOne(getEngines, emptyFunction.thatReturnsTrue);
