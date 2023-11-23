import fs from 'fs';
import pathlib from 'path';
import {CONTENT_SCRIPT_FILENAME, SERVER_DEFAULT_PORT} from 'shared/constants';
import {ResolvedConfig, Plugin as VitePlugin} from 'vite';
import {extname} from 'path';
import {__dirname, injectScriptIntoHTML} from './utils.js';
import {resolvePort} from './server.js';

interface VscodeUiConnectorPluginOptions {
	/**
	 * List of extra ignored elements,
	 * The click won't include objects from their shadow-dom.
	 * Use this when vscode opens the wrong file for an element.
	 */
	ignoredShadowDoms: string[];
}

export async function vscodeUiConnectorPlugin(
	options: Partial<VscodeUiConnectorPluginOptions> = {}
): Promise<VitePlugin> {
	let contentScript = fs
		.readFileSync(pathlib.join(__dirname, CONTENT_SCRIPT_FILENAME))
		.toString();
	const port = await resolvePort();
	if (port !== SERVER_DEFAULT_PORT) {
		contentScript = contentScript.replace(
			new RegExp(String(SERVER_DEFAULT_PORT), 'g'),
			port.toString()
		);
	}
	contentScript = `
     window.VUC = {
          ignoredShadowDoms: ${JSON.stringify(options.ignoredShadowDoms ?? [])}
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
