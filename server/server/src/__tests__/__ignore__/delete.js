// @flow

/** @middleware delete middleware */
export default (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.end('delete');
};
