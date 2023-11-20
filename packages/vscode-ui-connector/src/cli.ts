import {ServerOptions, getComposedConfig} from './config.js';
import {resolvePort, startServer} from './server.js';

export async function cli() {
	const config = getComposedConfig();

	config.port = await resolvePort();

	startServer(config as ServerOptions);
}
