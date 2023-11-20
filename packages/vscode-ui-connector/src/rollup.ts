import fs from 'fs';
import pathlib from 'path';
import {CONTENT_SCRIPT_FILENAME, SERVER_DEFAULT_PORT} from 'shared/constants';
import {Plugin} from 'rollup';
import {extname} from 'path';
import {__dirname} from './utils.js';
import {resolvePort} from './server.js';

let scriptContent = fs
	.readFileSync(pathlib.join(__dirname, CONTENT_SCRIPT_FILENAME))
	.toString();
const port = await resolvePort();
if (port !== SERVER_DEFAULT_PORT) {
	scriptContent = scriptContent.replace(
		new RegExp(String(SERVER_DEFAULT_PORT), 'g'),
		String(port)
	);
}

let injected = false;
const extensions = ['js', 'ts'];

export function vscodeUiConnector(): Plugin {
	return {
		name: 'vscode-ui-connector',

		buildStart() {},

		resolveId() {
			// This is needed for Vite, to make sure the script is reinjected
			// when the page reloads.
			injected = false;
		},

		transform(code, id) {
			if (!injected && extensions.some((ext) => extname(id) === `.${ext}`)) {
				code += `\n\n// Injected content script\n${scriptContent}`;
				injected = true;
			}
			return code;
		},
	};
}
