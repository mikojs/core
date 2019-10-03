// @flow

/** mock net */
class Net {
  +callback = jest.fn<[string, () => void], void>();

  +main = {
    connect: () => ({
      end: this.callback,
      on: this.callback,
      once: this.callback,
    }),
    createServer: (callback: ({}) => void): {} => {
      callback({
        setEncoding: jest.fn<$ReadOnlyArray<void>, void>(),
        on: this.callback,
      });

      return {
        on: this.callback,
        listen: this.callback,
        close: (closeCallback: () => void) => {
          this.callback('close', closeCallback);
        },
      };
    },
  };
}

export const net = new Net();
export default net.main;
