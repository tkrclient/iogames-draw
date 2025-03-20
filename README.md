## What this whiteboard actually looks like

![png](screenshots/screenshot.png)

## Features of this whiteboard
- can change color
- can change speed of how fast to load drawings...
- exposed websocket, so you can customize client side
- using nodejs ws backend
- has eraser feature
- remembers, by default, the last 10000 drawing points...
- has wipe clipboard (client-side only, because annoying...)
- extremely small codebase (less than 1000 loc, not counting dependencies)
- only about five dependencies
- remembers the last color you had (with cookie)
- gives you random color if new user (no cookie)
- touch screen support!

## Chat Example

This application shows how to use the
[websocket](https://github.com/gorilla/websocket) package to implement a simple
web chat application.

## Running the example


## Whiteboard Example

This application shows hot to use the
[websocket](https://www.npmjs.com/package/ws) dependency to implement a simple
whiteboard application.

## Running the example

The example requires a working npm/nodejs development environment. The [Getting 
Started](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) page describes how to install the
development environment. Or just install from your package manager.

Once you have npm up and running, you can download, build and run the example
using the following commands.

    $ npm install
    $ npm start

To use the whiteboard example, open http://localhost:4000/home.html in your browser.
