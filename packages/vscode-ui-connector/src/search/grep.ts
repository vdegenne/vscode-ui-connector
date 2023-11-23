import {execSync} from 'child_process';
import {glob} from 'glob';
import {Search, SearchMatch, SearchResult} from './search.js';

export function grep(search: Search, include: string | string[]): SearchResult {
	const result: SearchResult = {
		search,
		matches: [],
	};

	const files = glob.sync(include);

	if (files.length === 0) {
		return result;
	}

	const grepCommand = `grep -rn '${search.query}' ${files.join(' ')}`;

	try {
		const grepOutput = execSync(grepCommand, {encoding: 'utf-8'});
		const lines = grepOutput.split('\n').filter((line) => line !== '');

		const matches: SearchMatch[] = lines.map((grepLine) => {
			const [filepath, line, ...rest] = grepLine.split(':');
			const lineContent = rest.join(':');
			const match: SearchMatch = {
				filepath,
				line: parseInt(line),
				column: lineContent.indexOf(search.query) + 1,
				lineContent,
			};
			return match;
		});

		result.matches = matches;

		return result;
	} catch (error: any) {
		if ('status' in error) {
			if (error.status === 1) {
				return result;
			}
		}
		// Something went wrong with subshell grep
		throw error;
	}
}
