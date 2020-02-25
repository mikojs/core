// @flow

export default jest
  .fn()
  .mockReturnValue(
    async (req: mixed, res: mixed, next: () => Promise<void>) => {
      res.locals = {
        webpack: {
          devMiddleware: {
            stats: {
              toJson: () => ({
                commons: '/commons.js',
                client: '/client.js',
              }),
            },
          },
        },
      };

      await next();
    },
  );
