import {execSync} from 'child_process';
import {glob} from 'glob';
import {Search, SearchMatch} from './search.js';

export const DEFAULT_GREP_INCLUDE = 'src/**/*.{ts,tsx,js,jsx,html,css}';

export function grep(
	search: Search,
	include: string | string[]
): SearchMatch[] {
	const files = glob.sync(include);

	if (files.length === 0) {
		return [];
	}

	const grepCommand = `grep -rn '${search.query}' ${files.join(' ')}`;

	try {
		const grepOutput = execSync(grepCommand, {encoding: 'utf-8'});
		const lines = grepOutput.split('\n').filter((line) => line !== '');

		const foundObjects: SearchMatch[] = lines.map((grepLine) => {
			const [filepath, line, lineContent] = grepLine.split(':');
			const foundObject: SearchMatch = {
				filepath,
				line: parseInt(line),
				column: lineContent.indexOf(search.query) + 1,
				nodeInformation: search.node,
				lineContent,
			};
			return foundObject;
		});

		return foundObjects;
	} catch (error: any) {
		if ('status' in error) {
			if (error.status === 1) {
				return [];
			}
		}
		// Something went wrong with subshell grep
		throw error;
	}
}
