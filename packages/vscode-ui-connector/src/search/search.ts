import {Context, NodeInformation, SearchSchema} from 'shared';

export interface SearchMatch {
	filepath: string;
	line: number;
	column: number;
	nodeInformation: NodeInformation;
	lineContent?: string;
}

export interface Search {
	query: string;
	node: NodeInformation;
}

type SearchResolve = (result: SearchMatch[]) => void;
type SearchMethod = (search: Search) => Promise<SearchMatch[]> | SearchMatch[];
type SearchStop = (
	result: SearchMatch[],
	resolve: SearchResolve
) => boolean | undefined;

export function search(
	context: Context,
	searchSchema: SearchSchema,
	searchMethod: SearchMethod,
	searchStop?: SearchStop
): Promise<SearchMatch[]> {
	return new Promise(async (resolve, reject) => {
		if (!searchStop) {
			// By default we want to resolve only if there is a unique match.
			searchStop = function (result, resolve) {
				if (result.length === 1) {
					resolve(result);
					return true;
				}
			};
		}
		async function _search(search: Search) {
			const result = await searchMethod(search);
			return searchStop(result, resolve);
		}

		for (const node of context) {
			// Resolve attributes that are specific to the current node.
			const schema = resolveSchemaForNode(searchSchema, node);

			for (const property of schema) {
				let searches: Search[] = [];

				// TAG-NAME
				if (property === 'tagName') {
					searches.push({query: `<${node.tagName}`, node});
				}
				// TEXT-CONTENT
				else if (property === 'textContent' && node.textContent) {
					searches = [{query: node.textContent, node}]; // as-is
				}
				// ATTRIBUTES
				else if (property.startsWith('attributes.')) {
					if (!node.attributes) continue;
					const [_, attrName] = property.split('.');
					const value = node.attributes[attrName];
					if (value === undefined) continue;

					if (value === '') {
						// If the value is empty, we should also try the bare versions
						searches.push({query: attrName, node});
						searches.push({query: `?${attrName}`, node}); // lit-html
						searches.push({query: `.${attrName}`, node}); // lit-html
					}
					searches.push({
						query: `${attrName}="${node.attributes[attrName]}"`,
						node,
					});
				}

				if (searches) {
					for (const search of searches) {
						if (await _search(search)) {
							// if the search resolved we return to make sure
							// to stop the internal function as well.
							return;
						}
					}
				}
			}
		}

		// Reject if nothing satisfied the search.
		reject();
	});
}

function resolveSchemaForNode(schema: SearchSchema, node: NodeInformation) {
	if (schema.includes('attributes')) {
		if (!node.attributes) {
			return schema.filter((prop) => prop !== 'attributes');
		}
		const explicitAttributeNames = schema.reduce((acc, current) => {
			if (current.startsWith('attributes.')) {
				const [_, attrName] = current.split('.');
				if (attrName) {
					acc.push(attrName);
				}
			}
			return acc;
		}, [] as SearchSchema);

		// Get the list of attributes that were not explicit in the schema
		const attrs = Object.keys(node.attributes).reduce((attrs, attr) => {
			if (!explicitAttributeNames.includes(attr)) {
				attrs.push(`attributes.${attr}`);
			}
			return attrs;
		}, [] as string[]);

		return schema.reduce((schema, property) => {
			if (property === 'attributes') {
				schema.push(...attrs);
			} else {
				schema.push(property);
			}
			return schema;
		}, [] as SearchSchema);
	}
}
