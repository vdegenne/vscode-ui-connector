import fs from 'fs';
import pathlib from 'path';
import {fileURLToPath} from 'url';
import {ResolvedConfig, Plugin as VitePlugin} from 'vite';
import {resolvePort} from './config.js';
import {injectScriptIntoHTML} from './utils.js';

const __dirname = pathlib.dirname(fileURLToPath(import.meta.url));

export const CONTENT_SCRIPT_FILEPATH = pathlib.join(
	__dirname,
	'..',
	'dist',
	'content-script.js'
);

export interface VscodeUiConnectorPluginOptions {
	/**
	 * List of extra ignored elements,
	 * The click won't include objects from their shadow-dom.
	 * Use this when vscode opens the wrong file for an element.
	 */
	ignoredShadowDoms: string[];

	/**
	 * Prints the composed path in the console when using
	 * alt + click on the UI.
	 */
	debug: boolean;

	/**
	 * Strategy to use to open best match file:
	 *
	 * - vscode (default): will open the file in VSCode.
	 * - tmux-vim: will send ":edit +<position> <filepath>" to the active tmux session,
	 *		which means the active window should have [n]vim open to work correctly.
	 */
	openStrategy: 'vscode' | 'tmux-vim';

	/**
	 * Post execution command to run on the host system.
	 */
	postExec: string | undefined;
}

export async function vscodeUiConnectorPlugin(
	options: Partial<VscodeUiConnectorPluginOptions> = {}
): Promise<VitePlugin> {
	let contentScript = fs.readFileSync(CONTENT_SCRIPT_FILEPATH).toString();
	const port = await resolvePort();
	if (port !== SERVER_DEFAULT_PORT) {
		contentScript = contentScript.replace(
			new RegExp(String(SERVER_DEFAULT_PORT), 'g'),
			port.toString()
		);
	}
	contentScript = `
window.VUC = {
	ignoredShadowDoms: ${JSON.stringify(options.ignoredShadowDoms ?? [])},
	debug: ${options.debug ?? false},
	openStrategy: "${options.openStrategy ?? 'vscode'}",
	postExec: "${options.postExec ?? ''}"
};
     ${contentScript}
     `;

	const extensions = ['html', 'js', 'ts'];

	let injectedIn: string;

	let viteConfig: ResolvedConfig | undefined;

	return {
		name: 'vscode-ui-connector',

		configResolved(config) {
			viteConfig = config;
		},

		transformIndexHtml(html) {
			if (viteConfig.command === 'serve') {
				// Inject the content script inside the index html
				return injectScriptIntoHTML(html, contentScript);
			}
		},

		transform(code, id) {
			if (viteConfig) {
				return null;
			}
			const ext = pathlib.extname(id).slice(1);
			if ((!injectedIn || id === injectedIn) && extensions.includes(ext)) {
				if (ext === 'html') {
					code = injectScriptIntoHTML(code, contentScript);
				} else {
					code += `\n\n// Injected content script\n${contentScript}`;
				}

				injectedIn = id;
			}
			return code;
		},
	};
}
