import {ServerOptions} from './config.js';
import {SERVER_DEFAULT_PORT} from 'shared/constants';

export const CONFIG_FILENAME = 'vscode-ui-connector.config.json';

export const DEFAULT_INCLUDE = 'src/**/*.{ts,tsx,js,jsx,html,css}';

export const DEFAULT_CONFIG: ServerOptions = {
	port: SERVER_DEFAULT_PORT,
	include: DEFAULT_INCLUDE,
};
