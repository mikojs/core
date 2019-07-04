// @flow

import fs from 'fs';
import path from 'path';

import { emptyFunction } from 'fbjs';

/**
 * @example
 * createLogs()
 *
 * @return {['combined', { stream }]} - create logs data
 */
export default (): [
  string,
  {
    stream: fs.WriteStream,
  },
] => {
  const logsFolder = path.resolve('./logs');

  if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);

  return [
    'combined',
    {
      stream: fs.createWriteStream(
        path.resolve(logsFolder, `${new Date().getTime()}.log`),
        {
          flags: 'a',
        },
      ),
      skip: emptyFunction.thatReturns(process.env.NODE_ENV === 'test'),
    },
  ];
};
