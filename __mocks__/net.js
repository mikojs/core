// @flow

/** mock net */
class Net {
  +callback = jest.fn<[string, () => void], void>();

  +main = {
    connect: () => ({
      end: (data: string, endCallback: () => void) => {
        this.callback('end', endCallback);
      },
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
        listen: (port: number, listenCallback: () => void) => {
          this.callback('listen', listenCallback);
        },
        close: (closeCallback: () => void) => {
          this.callback('close', closeCallback);
        },
      };
    },
  };
}

export const net = new Net();
export default net.main;
