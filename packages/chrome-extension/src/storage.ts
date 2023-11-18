const HANDLE = 'vscode-ui-connector:port';
const DEFAULT_PORT = '53874';

export function getPort() {
	let port = localStorage.getItem(HANDLE);
	if (port === null) {
		port = DEFAULT_PORT;
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
