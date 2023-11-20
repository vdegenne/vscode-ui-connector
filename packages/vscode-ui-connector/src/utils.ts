import {fileURLToPath} from 'url';
import {dirname} from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function convertToWindowsPathIfNecessary(path) {
	if (process.platform === 'win32') {
		return path.replace(/\//g, '\\');
	}
	return path;
}
