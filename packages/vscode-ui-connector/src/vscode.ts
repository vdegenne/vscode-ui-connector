import {execSync} from 'child_process';
import {VscodeUiConnectorPluginOptions} from './rollup.js';

export function openFileAtLine(
	filepath: string,
	line: number,
	col?: number | undefined,
	opts?: VscodeUiConnectorPluginOptions
) {
	const position = col ? `${line}:${col}` : `${line}`;
	const command = `code -g ${filepath}:${position}`;

	try {
		execSync(command);
		if (opts?.postExec) {
			execSync(opts.postExec);
		}
	} catch (error) {
		console.error('Error occurred while opening file in VSCode:', error);
	}
}
