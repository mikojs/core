import { execUtils } from '@yarnpkg/core';

export default async (argv, { stdout, ...options }) => {
  try {
    const { code } = await execUtils.pipevp(argv[0], argv.slice(1), {
      ...options,
      stdout,
    });

    return code;
  } catch (e) {
    stdout.write.interceptor.end();

    return 1;
  }
};
