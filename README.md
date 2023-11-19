## Installation

### Clone the repository

```
git clone https://github.com/vdegenne/vscode-ui-connector.git
```

### Installation the dependencies and build

```
npm i && npm run build
```

### Add the extension in your browser
The extension root directory is located at `packages/chrome-extension`

**NOTE: Soon available on the Chrome Store!**

### In your project install the connector server
```
npm i -D vscode-connector-server
```

Now you can use `npx vscode-connector-server` (or the short version `npx vuc`) directly from the command line (or `vuc` in your npm scripts.)


## Usage

`Alt + click` on any element in your page to open it in VSCode.


## License

MIT (c) 2023 Valentin Degenne