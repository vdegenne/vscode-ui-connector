import {IGNORED_CLASSES, IGNORED_ELEMENTS} from '../constants.js';
import {
	Context,
	DevInformation,
	NodeInformation,
	typesToExcludeFromTypeIndex,
} from '../context.js';

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
		const nodeInfo: NodeInformation = {
			tagName: node.tagName.toLocaleLowerCase(),
			textContent: node.textContent,
			attributes: Object.fromEntries(
				[...node.attributes].map((attribute) => [
					attribute.name,
					attribute.value,
				])
			),
			// ...(typeIndex >= 0 ? {typeIndex} : {}),
			// classHierarchy: getHierarchy(node),
		};
		const typeIndex = getTypeIndex(node);
		if (typeIndex >= 0) {
			nodeInfo.typeIndex = typeIndex;
		}
		if (!IGNORED_ELEMENTS.includes(nodeInfo.tagName)) {
			const classHierarchy = [...new Set(getHierarchy(node))].filter(
				(className) =>
					!IGNORED_CLASSES.some((ignored) => className.startsWith(ignored))
			);
			nodeInfo.classHierarchy = classHierarchy;
		}

		return nodeInfo;
	}
}

function getTypeIndex(node: Element) {
	const tagName = node.tagName.toLocaleLowerCase();
	if (!typesToExcludeFromTypeIndex.includes(tagName)) {
		if (node.parentElement) {
			const types = node.parentElement.querySelectorAll(`:scope > ${tagName}`);
			if (types.length > 1) {
				return [...types].indexOf(node);
			}
		}
	}
	return -1;
}

function getHierarchy(node: Element) {
	const hierarchy: string[] = [];
	let proto = node;

	while (proto !== null) {
		hierarchy.push(proto.constructor.name);
		proto = Object.getPrototypeOf(proto);
	}

	return hierarchy;
}
