import {IGNORED_ELEMENTS} from '../constants.js';
import {Context, DevInformation, NodeInformation} from '../context.js';

export function getNodeInformationFromTarget(
	target: EventTarget
): (NodeInformation & DevInformation) | null {
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

		// Composed context object
		return {
			tagName: node.tagName.toLocaleLowerCase(),
			textContent: node.textContent,
			attributes: Object.fromEntries(
				[...node.attributes].map((attribute) => [
					attribute.name,
					attribute.value,
				])
			),
			// node,
		};
	}
}
