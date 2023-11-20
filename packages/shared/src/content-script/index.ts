import type {Context, ClientServerBody} from '../index.js';
import {getPort} from './storage.js';
import {getNodeInformationFromTarget} from './utils.js';

document.addEventListener('click', async (event: MouseEvent) => {
	const composedPath = event.composedPath();
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		const context: Context = [];
		for (const target of composedPath) {
			const nodeInfo = getNodeInformationFromTarget(target);
			if (nodeInfo) {
				context.push(nodeInfo);
			}
		}

		console.log(composedPath, context);

		// We send the information to the connector server
		const port = getPort();
		fetch(`http://localhost:${port}/`, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({context} as ClientServerBody),
		});
	}
});
