import {SERVER_DEFAULT_PORT} from 'shared/constants';
const HANDLE = 'vscode-ui-connector:port';

export function getPort() {
	let port = localStorage.getItem(HANDLE);
	if (port === null) {
		port = SERVER_DEFAULT_PORT;
		localStorage.setItem(HANDLE, port);
	}
	return port;
	// return new Promise((resolve) => {
	// 	chrome.storage.local.get(['port'], function (options) {
	// 		if (options['port']) {
	// 			resolve(options['port']);
	// 		} else {
	// 			const defaultValue = Math.floor(Math.random() * 1000);
	// 			chrome.storage.local.set({port: defaultValue});
	// 			resolve(defaultValue);
	// 		}
	// 	});
	// });
}
