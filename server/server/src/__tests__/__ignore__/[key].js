// @flow

/** @middleware get middleware */
export default (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.write(JSON.stringify(req.query));
  res.end();
};
