import fs from 'fs';
import pathlib from 'path';
import {CONTENT_SCRIPT_FILENAME, SERVER_DEFAULT_PORT} from 'shared/constants';
import {Plugin} from 'rollup';
import {getPort} from './config.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let scriptContent = fs
	.readFileSync(pathlib.join(__dirname, CONTENT_SCRIPT_FILENAME))
	.toString();
const port = getPort();
if (port !== SERVER_DEFAULT_PORT) {
	scriptContent = scriptContent.replace(
		new RegExp(String(SERVER_DEFAULT_PORT), 'g'),
		String(port)
	);
}

// TODO: complete this plugin so `scriptContent` is inserted somewhere in the code during dev.
export function vscodeUiConnector(): Plugin {
	return {
		name: 'vscode-ui-connector',
	};
}
