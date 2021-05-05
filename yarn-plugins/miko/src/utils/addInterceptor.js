export default stdout => {
  if (stdout.write.interceptor) return;

  const stdoutWrite = stdout.write.bind(stdout);
  const interceptor = (chunk, encoding, callback) => {
    if (/Usage Error/.test(chunk)) interceptor.errorMessage = chunk;
    else stdoutWrite(chunk, encoding, callback);
  };

  stdout.write = interceptor;
  interceptor.interceptor = interceptor;
  interceptor.end = () => {
    if (interceptor.errorMessage) stdoutWrite(interceptor.errorMessage);

    stdout.write = stdoutWrite;
  };
};
