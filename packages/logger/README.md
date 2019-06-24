# [@cat-org/logger][website] · <!-- badges.start -->[![npm][npm-image]][npm-link] ![npm-size][npm-size-image]

[npm-image]: https://img.shields.io/npm/v/@cat-org/logger.svg
[npm-link]: https://www.npmjs.com/package/@cat-org/logger
[npm-size-image]: https://img.shields.io/bundlephobia/minzip/@cat-org/logger.svg

<!-- badges.end -->

[website]: https://cat-org.github.io/core/logger

Normalize the logger with the log name.

## Install

```sh
yarn add @cat-org/logger --dev
```

## Use default logger

The default logger can be used in `node` and `browser`.

```js
import logger from '@cat-org/logger';

const log = logger('@cat-org/logger');

log.succeed('message'); // you can use log, succeed, fail, warn, info
```

## Use ora logger

You should install `ora` before using this.

```js
import logger from '@cat-org/logger';

const log = logger('@cat-org/logger', 'ora').init();

log.start('message'); // you can use log, succeed, fail, warn, info, start
```

#### With the custom options

```js
const log = logger('@cat-org/logger', 'ora').init({
  // ora options
});
```

## Use custom logger

```js
import logger from '@cat-org/logger';

const log = logger('@cat-org/logger', {
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
