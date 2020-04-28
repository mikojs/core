// @flow

/** @middleware post middleware */
export default (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.send('post');
};
