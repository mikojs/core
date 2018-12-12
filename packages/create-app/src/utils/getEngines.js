// @flow

import envinfo from 'envinfo';
import memoizeOne from 'memoize-one';

export default memoizeOne(
  async (): Promise<{
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
  },
  () => false,
);
