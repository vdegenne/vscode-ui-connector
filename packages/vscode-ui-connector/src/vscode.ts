import {execSync} from 'child_process';
import {ServerOptions} from './config.js';

export function openFileAtLine(
	filepath: string,
	line: number,
	col?: number | undefined,
	_opts?: ServerOptions,
) {
	const position = col ? `${line}:${col}` : `${line}`;
	const command = `code -g ${filepath}:${position}`;

	try {
		execSync(command);
	} catch (error) {
		console.error('Error occurred while opening file in VSCode:', error);
	}
}
