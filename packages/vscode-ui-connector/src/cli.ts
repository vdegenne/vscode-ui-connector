import {writeFile} from 'fs/promises';
import getPort from 'get-port';
import {CONFIG_FILENAME, getComposedConfig, getUserConfig} from './config.js';
import {startServer} from './server.js';

export async function cli() {
	const userConfig = getUserConfig();

	if (userConfig.port === undefined) {
		/**
		 * If the user hasn't provided a port,
		 * we generate a default one which is strictly
		 * minimum required information.
		 */
		const port = await getPort();

		// Save the port in the file
		await writeFile(
			CONFIG_FILENAME,
			JSON.stringify({port, ...userConfig}, null, 2)
		);
	}

	const config = getComposedConfig();

	startServer(config);
}
