import fs from 'fs';
import pathlib from 'path';
import {SERVER_DEFAULT_PORT} from './constants.js';
import {ResolvedConfig, Plugin as VitePlugin} from 'vite';
import {extname} from 'path';
import {injectScriptIntoHTML} from './utils.js';
import {resolvePort} from './config.js';
import {__dirname} from './path.js';

export const CONTENT_SCRIPT_FILEPATH = pathlib.join(
	__dirname,
	'..',
	'dist',
	'content-script.js'
);

interface VscodeUiConnectorPluginOptions {
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
          debug: ${options.debug ?? false}
     };
     ${contentScript}
     `;

	let injected: boolean;
	const extensions = ['html', 'js', 'ts'];

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

		buildStart() {
			injected = false;
		},

		transform(code, id) {
			if (viteConfig) {
				return null;
			}
			const extension = extname(id).slice(1);
			if (!injected && extensions.some((ext) => extension === ext)) {
				if (extension === 'html') {
					code = injectScriptIntoHTML(code, contentScript);
				} else {
					code += `\n\n// Injected content script\n${contentScript}`;
				}
				injected = true;
			}
			return code;
		},
	};
}
