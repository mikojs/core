# [@mikojs/logger][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@mikojs/logger.svg
[npm-link]: https://www.npmjs.com/package/@mikojs/logger
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@mikojs/logger.svg

<!-- badges.end -->

[website]: https://mikojs.github.io/core/logger

Normalize the logger with the log name.

## Install

```sh
yarn add @mikojs/logger --dev
```

## Use default logger

The default logger can be used in `node` and `browser`.

```js
import logger from '@mikojs/logger';

const log = logger('@mikojs/logger');

log.succeed('message'); // you can use log, succeed, fail, warn, info
```

## Use ora logger

You should install `ora` before using this.

```js
import logger from '@mikojs/logger';

const log = logger('@mikojs/logger', 'ora').init();

log.start('message'); // you can use log, succeed, fail, warn, info, start
```

#### With the custom options

```js
const log = logger('@mikojs/logger', 'ora').init({
  // ora options
});
```

## Use custom logger

```js
import logger from '@mikojs/logger';

const log = logger('@mikojs/logger', {
  init: args => {
    // do something to initialize logger
  },
  log: message => `handle-message-${message}`,
  customMethod: {
    getName: name => `render-custom-${name}`, // optional
    print: message => `handle-message-${message}`,
    after: name => {
      // optional
      // do something after running log
    },
  },
});
```
