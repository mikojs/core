export default stdout => {
  if (stdout.write.stdoutInterceptor) return stdout;

  const originalStdoutWrite = stdout.write.bind(stdout);
  const stdoutInterceptor = (chunk, encoding, callback) => {
    if (/Usage Error/.test(chunk)) stdoutInterceptor.errorMessage = chunk;
    else originalStdoutWrite(chunk, encoding, callback);
  };

  stdoutInterceptor.stdoutInterceptor = stdoutInterceptor;
  stdoutInterceptor.end = () => {
    originalStdoutWrite(stdoutInterceptor.errorMessage);
    stdout.write = originalStdoutWrite;
  };

  stdout.write = stdoutInterceptor;

  return stdout;
};
