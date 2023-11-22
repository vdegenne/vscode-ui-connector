import {
	type Context,
	type ClientServerBody,
	cleanContextObject,
} from '../context.js';
import {getPort} from './storage.js';
import {getNodeInformationFromTarget} from './node-information.js';

const port = getPort();

document.addEventListener('click', async (event: MouseEvent) => {
	const composedPath = event.composedPath();
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		let context: Context = [];
		for (const target of composedPath) {
			const nodeInfo = getNodeInformationFromTarget(target);
			if (nodeInfo) {
				context.push(nodeInfo);
			}
		}

		console.log(composedPath);
		console.log(JSON.parse(JSON.stringify(context)));
		context = cleanContextObject(context);
		console.log(JSON.parse(JSON.stringify(context)));

		// We send the information to the connector server
		fetch(`http://localhost:${port}/`, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify({context} as ClientServerBody),
		});
	}
});

console.log(`VSCode Ui Connector Content Script Loaded! (port: ${port})`);
