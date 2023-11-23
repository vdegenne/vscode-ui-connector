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

export function injectScriptIntoHTML(
	html: string,
	contentScript: string
): string {
	const scriptTag = `<script>${contentScript}</script>`;
	const indexOfBody = html.indexOf('</body>');

	if (indexOfBody !== -1) {
		const modifiedHTML = `${html.slice(0, indexOfBody)}${scriptTag}${html.slice(
			indexOfBody
		)}`;
		return modifiedHTML;
	} else {
		// If no </body> tag found, simply append the script to the end of the HTML
		return `${html}${scriptTag}`;
	}
}
