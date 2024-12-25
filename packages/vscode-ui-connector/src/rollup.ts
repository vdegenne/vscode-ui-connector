import fs from 'fs';
import pathlib from 'path';
import {ResolvedConfig, Plugin as VitePlugin} from 'vite';
import {resolvePort} from './config.js';
import {CONTENT_SCRIPT_PORT_PLACEHOLDER} from './constants.js';
import {injectScriptIntoHTML} from './utils.js';

const __dirname = import.meta.dirname;

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
}

export function vscodeUiConnectorPlugin(
	options: Partial<VscodeUiConnectorPluginOptions> = {}
): VitePlugin {
	const port = resolvePort();
	if (port === undefined) {
		throw new Error(`******************************************************************\n
* Couldn't find a valid port.\n
* Make sure the config file \`.vuc.json\` exists\n
* and has a valid port in it\n
* or run the server prior to the client\n
* to generate one automatically.\n
*******************************************************************\n`);
	}

	let contentScript = fs.readFileSync(CONTENT_SCRIPT_FILEPATH).toString();

	contentScript = contentScript.replace(
		new RegExp(String(CONTENT_SCRIPT_PORT_PLACEHOLDER), 'g'),
		port.toString()
	);

	contentScript = `
window.VUC = {
	ignoredShadowDoms: ${JSON.stringify(options.ignoredShadowDoms ?? [])},
	debug: ${options.debug ?? false},
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
