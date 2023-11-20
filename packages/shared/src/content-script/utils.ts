import {IGNORED_ELEMENTS} from '../constants.js';
import {NodeInformation} from '../index.js';

export function getNodeInformationFromTarget(
	target: EventTarget
): NodeInformation | null {
	if (target instanceof DocumentFragment) {
		return null;
	}

	if (target instanceof Element) {
		const node = target;
		if (node.tagName === 'SLOT') {
			return null;
		}
		// We make sure we are not inside the shadowDom of ignored elements.
		const rootNode = node.getRootNode();
		let parentTagName: string;
		if (rootNode instanceof DocumentFragment) {
			// We're inside a shadow
			parentTagName = (rootNode as ShadowRoot).host.tagName.toLocaleLowerCase();

			if (IGNORED_ELEMENTS.some((name) => parentTagName.startsWith(name))) {
				return null;
			}
		}

		// Start composing info object
		const tagName = node.tagName.toLocaleLowerCase();
		const id = node.getAttribute('id');
		const textContent = node.textContent.trim();
		const classText = node.getAttribute('class');
		// const cssText = (node as HTMLElement).style.cssText;
		const styleText = node.getAttribute('style');
		const className = node.className;
		return {
			tagName,
			...(id ? {id} : {}),
			...(textContent ? {textContent} : {}),
			...(classText ? {classText} : {}),
			...(styleText ? {styleText} : {}),
			...(className ? {className} : {}),
		};
	}
}
