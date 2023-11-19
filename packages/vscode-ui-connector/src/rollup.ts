import fs from 'fs';
import {CONTENT_SCRIPT_FILENAME, SERVER_DEFAULT_PORT} from 'shared/constants';
import {Plugin} from 'rollup';
import {getPort} from './config.js';

let scriptContent = fs.readFileSync(CONTENT_SCRIPT_FILENAME).toString();
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
