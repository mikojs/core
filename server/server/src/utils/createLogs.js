// @flow

import fs from 'fs';
import path from 'path';

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
    },
  ];
};
