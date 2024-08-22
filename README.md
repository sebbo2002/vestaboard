<p align="center">
    <img src="https://d.sebbo.net/vestaboard-client-logo-CHm68XZRk-zNNTOboqFhVFbeuN6ccZkBsvGQxAJPx5GCBbSI2GnbSse6ovApzaULciWRnoOTzOny70L7Rcpv0SIkOPGIwCC3ZDsJFNeH1A00lB.png" alt="Logo" />
</p>

# `@sebbo2002/vestaboard`

[![MIT LICENSE](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/sebbo2002/vestaboard/blob/develop/LICENSE)
[![CI Status](https://img.shields.io/github/actions/workflow/status/sebbo2002/vestaboard/test-release.yml?style=flat-square)](https://github.com/sebbo2002/vestaboard/actions)

<br />


Just another client for the [Vestaboard](https://www.vestaboard.com/) [APIs](https://docs.vestaboard.com/). It supports 
the [Subscription API](https://docs.vestaboard.com/methods), [Read/Write API](https://docs.vestaboard.com/read-write) and 
the [Local API](https://docs.vestaboard.com/local). Written in Typescript.

The library also provides a small collection of helpers to format messages on the Vestaboard. This includes a `write()` 
method that automatically wraps text, a `fill()` method to fill the board with nice characters, or `table()` to conjure 
up a table on the board.


## 📦 Installation

	npm i --save @sebbo2002/vestaboard


## ⚡️ Quick Start

#### Draw some patterns using the Subscription API

```js
import { SubscriptionAPI, Message } from '@sebbo2002/vestaboard';
const api = new SubscriptionAPI('3eadf7a8-6602-4bf5-92f4-970d36066958', '******************************');
const msg = new Message().fill('🟥🟧🟨🟩🟦🟪');

api.postMessage(msg);
```

#### Write a calendar on a local Vestaboard
```js
import { LocalAPI, Message } from '@sebbo2002/vestaboard';
const api = new LocalAPI('***');
const msg = new Message().table([
  ['now', 'Daily'],
  ['13:00', 'Super Secret Meeting'],
  ['16:30', 'Awesome Presentation']
]);

api.postMessage(msg);
```

#### Write Hello World on multiple local boards
```js
import { MultipleBoards, LocalAPI, Message } from '@sebbo2002/vestaboard';
const board1 = new LocalAPI('***');
const board2 = new LocalAPI('***');
const boards = new MultipleBoards([board1, board2]);

boards.postMessage('Hello World');
```

See the [examples](./examples) folder for more examples.


## 📑 API-Reference

- [Index](https://sebbo2002.github.io/vestaboard/develop/reference/)
  - [LocalAPI](https://sebbo2002.github.io/vestaboard/develop/reference/classes/LocalAPI.html)
  - [Message](https://sebbo2002.github.io/vestaboard/develop/reference/classes/Message.html)
  - [MultipleBoards](https://sebbo2002.github.io/vestaboard/develop/reference/classes/MultipleBoards.html)
  - [ReadWriteAPI](https://sebbo2002.github.io/vestaboard/develop/reference/classes/ReadWriteAPI.html)
  - [SubscriptionAPI](https://sebbo2002.github.io/vestaboard/develop/reference/classes/SubscriptionAPI.html)


## 🚦 Tests

Some unit tests use the Vestaboard API to run the tests. You can use the `.env.example` file as a template and enter your 
data there accordingly.

```
npm test
npm run coverage
```


## 🙆🏼‍♂️ Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
