import fs from 'fs';
import {CONFIG_FILENAME, DEFAULT_CONFIG} from './constants.js';
import _getPort from 'get-port';

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

export function getConfigFile(): Partial<ServerOptions> | null {
	try {
		const fileContent = fs.readFileSync(CONFIG_FILENAME);
		return JSON.parse(fileContent.toString());
	} catch (e) {
		return null;
	}
}

export async function getPort(): Promise<number> {
	const config = getConfigFile() ?? {};

	if (config.port === undefined) {
		const port = await _getPort();
		config.port = port;
	}

	return config.port;
}
