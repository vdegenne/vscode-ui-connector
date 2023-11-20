import {getConfigFile} from './config.js';
import {DEFAULT_CONFIG} from './constants.js';
import {startServer} from './server.js';

export function cli() {
	const config = {
		// default
		...DEFAULT_CONFIG,
		// config
		...(getConfigFile() ?? {}),
	};

	startServer(config);
}
