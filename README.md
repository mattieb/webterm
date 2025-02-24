# webterm

Because I wanted a terminal app neither sang nor danced… but then I got a little wild with it.

webterm is a simple [Electron](https://www.electronjs.org) terminal app.

## Building

To get started:

```shell
npm install
npm run build
```

## Using the Electron app

The Electron app is a pretty standard [Electron Forge](https://www.electronforge.io) setup.

In the [app](./app) directory:

```shell
npm start
```

Currently only supports macOS, but it shouldn't take much to bring it elsewhere.

A standalone app can be built:

```shell
npm run build:app
```
