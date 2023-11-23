import {LOCAL_STORAGE_HANDLER, SERVER_DEFAULT_PORT} from '../constants.js';

export function getPort() {
	const storageValue = localStorage.getItem(LOCAL_STORAGE_HANDLER);
	let port: number;
	if (storageValue) {
		port = parseInt(storageValue);
	} else {
		port = SERVER_DEFAULT_PORT;
		// localStorage.setItem(LOCAL_STORAGE_HANDLER, String(port));
	}
	return port;
}
