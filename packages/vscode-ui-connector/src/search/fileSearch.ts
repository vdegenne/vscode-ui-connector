import fs from 'fs';
import {Search, SearchResult} from './search.js';

export async function fileSearch(
	search: Search,
	filepath: string,
	fromLine = 1
): Promise<SearchResult> {
	// Open the file
	const contents = await fs.promises.readFile(filepath, {encoding: 'utf-8'});

	const lines = contents.toString().split('\n');

	const result: SearchResult = {
		search,
		matches: [],
	};

	for (let n = fromLine - 1; n < lines.length; ++n) {
		const lineContent = lines[n];
		const index = lineContent.indexOf(search.query);
		if (index >= 0) {
			result.matches.push({
				filepath,
				line: n + 1,
				column: index + 1,
				lineContent,
			});
		}
	}

	return result;
}
