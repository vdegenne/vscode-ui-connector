import {writeFile} from 'fs/promises';
import getPort from 'get-port';
import {CONFIG_FILENAME, getUserConfig, type ServerOptions} from './config.js';
import {DEFAULT_OPTIONS} from './constants.js';
import {startServer} from './server.js';

export async function cli() {
	let config = getUserConfig();

	// if (userConfig === null) {
	// 	throw new Error('Config file ".vuc.json" not found.');
	// }

	// Compose config
	config = {...DEFAULT_OPTIONS, ...(config ?? {})};

	if (config.port === undefined) {
		/**
		 * If the user hasn't provided a port,
		 * we generate a default one which is strictly
		 * minimum required information.
		 */
		config.port = await getPort();

		// Save the port in the file
		await writeFile(CONFIG_FILENAME, JSON.stringify(config, null, 2));
	}

	startServer(config as ServerOptions);
}
