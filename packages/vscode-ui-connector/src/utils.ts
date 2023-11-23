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
