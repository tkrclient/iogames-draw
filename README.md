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

## Whiteboard Example

This application is the whiteboard application.

## Running the example

Build and run the server.

    $ npm install
		$ npm install ws
    $ npm start

To use the whiteboard example, open http://localhost:4000/home.html in your browser.
