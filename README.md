## What this whiteboard actually looks like

![png](screenshots/screenshot.png)

## Features of this whiteboard
- Can change color
- Can change speed of how fast to load drawings...
- Exposed websocket, so you can customize client side
- Using nodejs ws backend
- Has eraser feature
- Remembers, by default, the last 10000 drawing points...
- Has wipe clipboard (client-side only, because annoying...)
- Extremely small codebase (less than 1000 loc, not counting dependencies)
- Only about five dependencies
- Remembers the last color you had (with cookie)
- Gives you random color if new user (no cookie)
- Touch screen support!

## Whiteboard Example

This application shows how to use the
[websocket](https://www.npmjs.com/package/ws) package to implement a simple
whiteboard application.

## Running the example

The example requires a working npm development environment. The [Getting 
Started](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) page describes how to install the
development environment. Or just install from your package manager.

Once you have npm up and running, you can download, build and run the example
using the following commands.

    $ npm install
    $ npm start

To use the whiteboard example, open http://localhost:4000/home.html in your browser.
