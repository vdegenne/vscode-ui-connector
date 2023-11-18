// import {getPort} from './storage';
import {convertNodeToInformationObject} from './utils.js';

document.addEventListener('click', async (event: MouseEvent) => {
	const composedpath = event.composedPath();
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		console.log(composedpath);
		const infoObject = composedpath.map((node) =>
			convertNodeToInformationObject(node as Element)
		);
		console.log(infoObject);
	}
});
