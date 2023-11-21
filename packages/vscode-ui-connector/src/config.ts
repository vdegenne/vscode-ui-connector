import fs from 'fs';
import _getPort from 'get-port';
import {SERVER_DEFAULT_PORT} from 'shared/constants';
import {DEFAULT_GREP_INCLUDE} from './search/grep.js';

export const CONFIG_FILENAME = 'vscode-ui-connector.config.json';

export interface ServerOptions {
	/**
	 * Port to use for the connector server.
	 */
	port: number;
	/**
	 * Files to include in the grep searches.
	 */
	include: string | string[];
}

export const DEFAULT_CONFIG: ServerOptions = {
	port: SERVER_DEFAULT_PORT,
	include: DEFAULT_GREP_INCLUDE,
};

/**
 * Returns user-defined config or null if not found.
 */
export function getUserConfig(): Partial<ServerOptions> | null {
	try {
		const fileContent = fs.readFileSync(CONFIG_FILENAME);
		return JSON.parse(fileContent.toString());
	} catch (e) {
		return null;
	}
}

/**
 * Returns the config made from combining user-defined config and default values.
 */
export function getComposedConfig(): ServerOptions {
	return {
		// default
		...DEFAULT_CONFIG,
		// config
		...(getUserConfig() ?? {}),
	};
}
