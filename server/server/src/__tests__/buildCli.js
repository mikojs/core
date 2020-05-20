// @flow

import getPort from 'get-port';
import fetch, { type Body as BodyType } from 'node-fetch';

import { type middlewareType } from '../index';
import buildCli, { type loggerType } from '../buildCli';

const mockLog = jest.fn();
const mockLogger = {
  start: mockLog,
  succeed: mockLog,
  fail: mockLog,
};

describe('build cli', () => {
  beforeEach(() => {
    mockLog.mockClear();
  });

  test('succeed', async () => {
    const port = await getPort();
    const server = await buildCli(
      ['node', 'server', '-p', port],
      __dirname,
      mockLogger,
      (folderPath: string, logger: loggerType): middlewareType<> => {
        logger('start', 'init', folderPath);
        logger('start', 'add', folderPath);
        logger('end', 'add', folderPath);

        return (req: http.IncomingMessage, res: http.ServerResponse) => {
          res.write('work');
          res.end();
        };
      },
    );

    expect(mockLog).toHaveBeenCalledTimes(4);
    expect(
      await fetch(`http://localhost:${port}`).then((res: BodyType) =>
        res.text(),
      ),
    ).toBe('work');

    server.close();
  });

  test('fail', async () => {
    await expect(
      buildCli(['node', 'server'], __dirname, mockLogger, () => {
        throw new Error('error');
      }),
    ).rejects.toThrow('error');
  });
});
