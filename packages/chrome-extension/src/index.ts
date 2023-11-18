// import {getPort} from './storage';
import {getInformationObjectFromNode} from './utils.js';

document.addEventListener('click', async (event: MouseEvent) => {
	const composedPath = event.composedPath();
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		console.log(composedPath);
		const infos = [];
		for (const target of composedPath) {
			const info = getInformationObjectFromNode(target);
			if (info) {
				infos.push(info);
			}
		}
		console.log(infos);
	}
});
