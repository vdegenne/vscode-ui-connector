import {type NodeInformation} from 'shared';

export function convertNodeToInformationObject(node: Element): NodeInformation {
	return {
		tagName: node.tagName?.toLocaleLowerCase(),
	};
}
