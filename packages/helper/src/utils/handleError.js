// @flow

import npmFetch from 'npm-registry-fetch';

/**
 * @example
 * findPackage('babel');
 *
 * @param {string} packageName - package name
 *
 * @return {string} - redirect package name
 */
const findPackage = (packageName: string): string => {
  switch (packageName) {
    case 'babel':
      return '@babel/cli';

    default:
      return packageName;
  }
};

export default async (errMessage: string): Promise<?string> => {
  if (/command not found/.test(errMessage)) {
    const packageName = findPackage(
      errMessage.replace(/.*: (.*): command not found\n/, '$1'),
    );

    try {
      const fetchPackage = await npmFetch.json(packageName);
      const [lastVersion] = Object.keys(fetchPackage.versions).slice(-1);
      const {
        dist: { tarball },
      } = fetchPackage.versions[lastVersion];

      return `install ${tarball}`;
    } catch (e) {
      return null;
    }
  }

  return null;
};
