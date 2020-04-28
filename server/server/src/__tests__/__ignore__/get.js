// @flow

/** @middleware get middleware */
export default (req: http.IncomingMessage, res: http.ServerResponse) => {
  res.json({ key: 'value' });
};
