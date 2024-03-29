# webterm

Because I wanted a terminal app neither sang nor danced… but then I got a little wild with it.

webterm comes in two flavors:

- an [Electron](https://www.electronjs.org) app
- a version that can be served by a web browser

## Building

webterm is a [monorepo](https://monorepo.tools) that contains both flavors as well as common code split out into packages.

To get started:

```shell
npm install
npm run build
```

To develop, use the [turbotree](https://github.com/mattieb/turbotree)-based watcher, which will watch and keep up-to-date both libraries and the browser web app, including starting and restarting the server when needed:

```shell
npm run watch
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
npm run make
```

Universal builds do not work due to packaging problems.

There is also an issue with electron-forge and NPM workspaces that is not yet resolved. electron-forge is configured to copy packages from the monorepo root node_modules to work around this, but this breaks "npm start" due to issues not finding the Electron framework. Running "npm install" again will repair this temporarily.

### Using the browser app

The browser app has its own [Express](https://expressjs.com) server that uses [express-ws](https://github.com/HenningM/express-ws) for WebSocket communication.

You will need a TLS certificate. I use [mkcert](https://mkcert.dev), then rename the resulting PEM files to "cert.pem" and "key.pem".

In the [browser](./browser) directory:

```shell
npm start
```
