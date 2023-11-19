import fs from 'fs';
import {CONFIG_FILENAME} from './constants.js';

export interface ServerOptions {
	/**
	 * Port to use for the connector server.
	 */
	port: string;
	/**
	 * Files to include in the grep searches.
	 */
	include: string | string[];
}

export function getConfig(): Partial<ServerOptions> | null {
	try {
		const fileContent = fs.readFileSync(CONFIG_FILENAME);
		return JSON.parse(fileContent.toString());
	} catch (e) {
		return null;
	}
}
