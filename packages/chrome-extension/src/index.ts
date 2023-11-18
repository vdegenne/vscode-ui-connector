import {getPort} from './storage.js';
import {getInformationObjectFromTarget} from './utils.js';

document.addEventListener('click', async (event: MouseEvent) => {
	const composedPath = event.composedPath();
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		const infos = [];
		for (const target of composedPath) {
			const info = getInformationObjectFromTarget(target);
			if (info) {
				infos.push(info);
			}
		}

		// We send the information to the connector server
		const port = getPort();
		fetch(`http://localhost:${port}/`, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(infos),
		});
	}
});
