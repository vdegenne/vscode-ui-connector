import {
	type ClientServerBody,
	type Context,
	cleanContextObject,
} from '../context.js';
import {type VscodeUiConnectorPluginOptions} from '../rollup.js';
import {getNodeInformationFromTarget} from './node-information.js';
import {getPort} from './storage.js';

declare global {
	interface Window {
		VUC: VscodeUiConnectorPluginOptions;
	}
}

const port = getPort();

window.addEventListener('click', async (event: MouseEvent) => {
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		const composedPath = event.composedPath();
		let context: Context = [];
		for (const target of composedPath) {
			const nodeInfo = getNodeInformationFromTarget(target);
			if (nodeInfo) {
				context.push(nodeInfo);
			}
		}

		if (window.VUC?.debug) {
			console.log(composedPath);
			console.log(JSON.parse(JSON.stringify(context)));
		}
		context = cleanContextObject(context);
		if (window.VUC?.debug) {
			console.log(JSON.parse(JSON.stringify(context)));
		}

		const body: ClientServerBody = {
			context,
			// opts: window.VUC
		};

		// We send the information to the connector server
		fetch(`http://localhost:${port}/`, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body),
		});
	}
});

console.log(`VSCode Ui Connector Content Script Loaded! (port: ${port})`);
