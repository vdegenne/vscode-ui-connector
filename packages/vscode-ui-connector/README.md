# vscode-ui-connector

## Installation

Install the npm package

```
npm i -D vscode-ui-connector
```

### Content Script

```javascript
/* rollup.config.js */
import {vscodeUiConnector} from 'vscode-ui-connector';

export default {
	plugins: [vscodeUiConnector()],
};
```

_explanation: The content script is injected in your page during development and listen for click events, it builds a context object and sends it to the server to find the best location in your source._

### Server

Use `vscode-ui-connector` in your npm scripts to start the server (or short version `vuc`). You can also use `npx vuc` from the command line. (Running the server as a service using `wireit` is the recommended way.)

_explanation: The server waits for the content script to send a context object, it then uses `grep` to find the best match and attempts to find the best location, and opens it in VSCode._

## Usage

Use `Alt + click` on any element in your page.

## License

MIT (c) 2023 Valentin Degenne
