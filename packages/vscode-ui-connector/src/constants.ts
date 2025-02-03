import {ServerOptions} from './config.js';

// export const SERVER_DEFAULT_PORT = 53874;
// export const CACHED_DIRECTORY = 'node_modules/.cache';
// export const CACHED_PORT_FILEPATH = `${CACHED_DIRECTORY}/vscode-ui-connector-port`;

export const CONTENT_SCRIPT_PORT_PLACEHOLDER = 9999999999;

export const IGNORED_SHADOW_DOMS = ['mwc-', 'md-'];
export const IGNORED_CLASSES = [
	'HTML',
	'Element',
	'Node',
	'EventTarget',
	'Object',
	'Function',
	'Mwc',
	'Md',
];

export const LOCAL_STORAGE_HANDLER = 'vscode-ui-connector:port';

export const DEFAULT_GREP_INCLUDE = './src/**/*.{ts,tsx,js,jsx,html,css}';

export const DEFAULT_OPTIONS: ServerOptions = {
	port: undefined,
	include: DEFAULT_GREP_INCLUDE,
	openStrategy: 'vscode',
	tmuxOptions: {
		session: ':',
	},
	postExec: undefined,
	debug: false,
};
