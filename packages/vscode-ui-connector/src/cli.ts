import {ServerOptions, getComposedConfig, resolvePort} from './config.js';
import {startServer} from './server.js';

export async function cli() {
	const config = getComposedConfig();

	config.port = await resolvePort();

	startServer(config as ServerOptions);
}
