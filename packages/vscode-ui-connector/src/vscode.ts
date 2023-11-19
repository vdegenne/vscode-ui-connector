import {execSync} from 'child_process';

export function openFileAtLine(
	filePath: string,
	lineNumber: number,
	columnNumber?: number
) {
	const position = columnNumber
		? `${lineNumber}:${columnNumber}`
		: `${lineNumber}`;
	const command = `code -g ${filePath}:${position}`;

	try {
		execSync(command);
	} catch (error) {
		console.error('Error occurred while opening file in VSCode:', error);
	}
}
