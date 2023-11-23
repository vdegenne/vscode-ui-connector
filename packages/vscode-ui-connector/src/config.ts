import fs from 'fs';
import _getPort from 'get-port';
import {
	CACHED_DIRECTORY,
	CACHED_PORT_FILEPATH,
	SERVER_DEFAULT_PORT,
} from './constants.js';
import {DEFAULT_GREP_INCLUDE} from './search/grep.js';
import {convertToWindowsPathIfNecessary} from './path.js';

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

export async function resolvePort(): Promise<number> {
	let port: number;
	// We resolve the port value following these priorities
	// 1. Cached port
	const portFilePath = convertToWindowsPathIfNecessary(CACHED_PORT_FILEPATH);
	if (fs.existsSync(portFilePath)) {
		return parseInt(fs.readFileSync(CACHED_PORT_FILEPATH).toString());
	}
	// 2. User-defined port
	const config = getUserConfig();
	if (config && config.port) {
		port = config.port;
	}

	// 3. Get a random port
	if (!port) {
		port = await _getPort();
	}

	// Cache the port
	if (!fs.existsSync(CACHED_DIRECTORY)) {
		await fs.promises.mkdir(CACHED_DIRECTORY);
	}
	fs.promises.writeFile(CACHED_PORT_FILEPATH, `${port}`);

	return port;
}
