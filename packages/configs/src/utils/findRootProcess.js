// @flow

import findProcess from 'find-process';

type returnType = {|
  pid: number,
  ppid: number,
  uid: number,
  gid: number,
  name: string,
  bin: string,
  cmd: string,
|};

/**
 * @example
 * findRootProcess('/')
 *
 * @param {string} filename - string
 * @param {number} pid - process.pid
 *
 * @return {returnType} - root process
 */
const findRootProcess = async (
  filename: string,
  pid: number = process.pid,
): Promise<?returnType> => {
  const [currentProcess] = await findProcess('pid', pid);

  if (!currentProcess) return null;

  const result = await findRootProcess(filename, currentProcess.ppid);

  if (
    result ||
    currentProcess.name !== 'node' ||
    require.resolve(currentProcess.cmd.split(/ /)[1]) !== filename
  )
    return result;

  return currentProcess;
};

export default findRootProcess;
