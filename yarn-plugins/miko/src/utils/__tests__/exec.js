import { execUtils } from '@yarnpkg/core';

import exec from '../exec';

describe('exec', () => {
  test('execute command successfully', async () => {
    execUtils.pipevp.mockResolvedValue({ code: 0 });

    expect(await exec([], {})).toBe(0);
  });

  test('execute command unsuccessfully', async () => {
    execUtils.pipevp.mockRejectedValue(new Error('error'));

    expect(
      await exec([], {
        stdout: {
          write: {
            interceptor: {
              end: jest.fn(),
            },
          },
        },
      }),
    ).toBe(1);
  });
});
