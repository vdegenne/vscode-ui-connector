export type AttributesProperty = {
	[attributeName: string]: string;
};
export type NodeInformation = {
	tagName: string;
	attributes: AttributesProperty;
	textContent?: string;
	/**
	 * If parent contains more than one element of the same type,
	 * this property will assume node position in the group.
	 */
	typeIndex?: number;
	classHierarchy?: string[];
};

export const typesToExcludeFromTypeIndex = ['div', 'span'];

export type DevInformation = {
	node?: Element;
};

export type Context = NodeInformation[];

export interface ClientServerBody {
	context: Context;
}

type LooseAutoComplete<T extends string> = T | Omit<string, T>;

type SearchSchemaValue = LooseAutoComplete<
	| 'tagName'
	| 'textContent'
	| 'attributes'
	| 'attributes.id'
	| 'attributes.class'
	| 'attributes.style'
	| 'classHierarchy'
>;

export type SearchSchema = SearchSchemaValue[];

/**
 * Remove undefined, null, empty arrays, etc.. from object.
 */
export function cleanContextObject(context: Context) {
	context = context.map((obj) => {
		// Delete unwanted values
		Object.keys(obj).forEach((key) => {
			if (
				obj[key] === undefined ||
				obj[key] === null ||
				obj[key] === '' ||
				(Array.isArray(obj[key]) && obj[key].length === 0) ||
				// Remove textContent if too tall
				(key === 'textContent' && countNewLines(obj.textContent) > 4) ||
				(key === 'attributes' && Object.keys(obj.attributes).length === 0) ||
				key === 'node'
			) {
				delete obj[key];
			}
		});

		// Clean some values
		if (obj.textContent) {
			obj.textContent = obj.textContent.replace(/[\n\t]*/g, '');
			// Remove unicodes
			// TODO: take that back?
			// obj.textContent = obj.textContent.replace(/[^\x00-\x7F]/g, "");
			obj.textContent = obj.textContent.trim();

			if (obj.textContent === '') {
				// Delete textContent if it is empty after cleaning
				delete obj.textContent;
			}
		}

		return obj;
	});

	return context;
}

function countNewLines(input: string) {
	const regex = /\r\n|\r|\n/g; // Regular expression to match newline characters
	const matches = input.match(regex);
	return matches ? matches.length : 0; // Return the number of matches found
}
