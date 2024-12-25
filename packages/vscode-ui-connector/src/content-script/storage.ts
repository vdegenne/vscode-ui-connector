import {
	CONTENT_SCRIPT_PORT_PLACEHOLDER,
	LOCAL_STORAGE_HANDLER,
} from '../constants.js';

export function getPort() {
	const storageValue = localStorage.getItem(LOCAL_STORAGE_HANDLER);
	let port: number;
	if (storageValue) {
		port = parseInt(storageValue);
	} else {
		port = CONTENT_SCRIPT_PORT_PLACEHOLDER;
		// localStorage.setItem(LOCAL_STORAGE_HANDLER, String(port));
	}
	return port;
}
