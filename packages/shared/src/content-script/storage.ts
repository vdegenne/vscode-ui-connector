import {SERVER_DEFAULT_PORT} from '../constants.js';
const HANDLE = 'vscode-ui-connector:port';

export function getPort() {
	const storageValue = localStorage.getItem(HANDLE);
	let port: number;
	if (storageValue) {
		port = parseInt(storageValue);
	} else {
		port = SERVER_DEFAULT_PORT;
		localStorage.setItem(HANDLE, String(port));
	}
	return port;
}
