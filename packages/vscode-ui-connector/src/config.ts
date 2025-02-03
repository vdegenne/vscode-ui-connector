import fs from 'fs';
import {DEFAULT_OPTIONS} from './constants.js';

export const CONFIG_FILENAME = '.vuc.json';

export interface ServerOptions {
	/**
	 * Port to use for the connector server.
	 * @default generated automatically when the server starts if it doesn't exist in user-config file.
	 */
	port: number | undefined;

	/**
	 * Files to include in the grep searches.
	 * @default all sources files under "src".
	 */
	include: string | string[];

	/**
	 * Display debug information in terminal where the server runs.
	 * @default false
	 */
	debug: boolean;

	/**
	 * Strategy to use to open best match file:
	 *
	 * - vscode (default): will open the file in VSCode.
	 * - tmux-vim: will send ":edit +<position> <filepath>" to the active tmux session,
	 *		which means the active window should have [n]vim open to work correctly.
	 *
	 * @default "vscode"
	 */
	openStrategy: 'vscode' | 'tmux-vim';

	/**
	 * Additional options for "tmux-vim" strategy.
	 */
	tmuxOptions: {
		/**
		 * Session's name where to run the command in.
		 * @default ":"
		 */
		session: string;
	};

	/**
	 * Post execution command to run on the host system.
	 */
	postExec: string | undefined;
}

// const defaultOptions: ServerOptions = {
// 	port: undefined,
// 	openStrategy: 'tmux-vim',
// 	debug: false,
// 	include: './src/**/*',
// 	tmuxOptions: {
// 		session: 'gits/jp-synonymes-dex',
// 	},
// 	postExec: 'wlrctl window focus Alacritty',
// };

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
		...DEFAULT_OPTIONS,
		...(getUserConfig() ?? {}),
	};
}

export function resolvePort(): number | undefined {
	let port: number | undefined;
	// We resolve the port value following these priorities
	// 1. Userdefined port
	const config = getUserConfig();
	if (config !== null && config.port) {
		port = config.port;
		// return config.port;
	}

	// // 2. Cached port (DEPRECATED)
	// const portFilePath = convertToWindowsPathIfNecessary(CACHED_PORT_FILEPATH);
	// if (fs.existsSync(portFilePath)) {
	// 	port = parseInt(fs.readFileSync(CACHED_PORT_FILEPATH).toString());
	// }
	//
	// // 3. Get a random port
	// if (port === undefined) {
	// 	port = await _getPort();
	// }
	//
	// // Cache the port
	// if (!fs.existsSync(CACHED_DIRECTORY)) {
	// 	await fs.promises.mkdir(CACHED_DIRECTORY);
	// }
	// // fs.promises.writeFile(CACHED_PORT_FILEPATH, `${port}`);
	// fs.promises.writeFile(CONFIG_FILENAME, JSON.stringify({port}, null, 2));

	return port;
}
