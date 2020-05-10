// @flow

/** @middleware get middleware */
export default (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.write(JSON.stringify({ key: 'value' }));
  res.end();
};
