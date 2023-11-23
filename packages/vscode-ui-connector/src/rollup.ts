import {readFile} from 'fs/promises';
import {join} from 'path';
import {CONTENT_SCRIPT_FILENAME, SERVER_DEFAULT_PORT} from 'shared/constants';
import {Plugin} from 'rollup';
import {__dirname} from './utils.js';
import {resolvePort} from './server.js';

const port = await resolvePort();
const SCRIPT_CONTENT_TAG = '// @VSUC Injected content script'
let injectTarget: string

let scriptContent = (await readFile(
	join(__dirname, CONTENT_SCRIPT_FILENAME)
)).toString()
	
if (port !== SERVER_DEFAULT_PORT) {
	scriptContent = scriptContent.replace(
		new RegExp(String(SERVER_DEFAULT_PORT), 'g'),
		String(port)
	);
}

export function vscodeUiConnector(): Plugin {
	return {
		name: 'rollup-plugin-vscode-ui-connector',

		buildStart(options) {
			if (!options.input && !injectTarget) return this.error('No input found, need atleast one.')
			if (Array.isArray(options.input)) 
				injectTarget = options.input[0];
			else if (typeof options.input === 'object')
				injectTarget = Object.values(options.input)[0]
			else
				injectTarget = options.input;
			return
		},

		transform(code, id) {
			if (id === injectTarget && !code.includes(SCRIPT_CONTENT_TAG)) {
				code += `\n\n${SCRIPT_CONTENT_TAG}\n${scriptContent}`;
			}
			return code;
		},
	};
}
