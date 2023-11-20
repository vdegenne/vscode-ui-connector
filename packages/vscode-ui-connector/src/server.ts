import Koa from 'koa';
import KoaRouter from '@koa/router';
import {bodyParser} from '@koa/bodyparser';
import cors from '@koa/cors';
import {ServerOptions, getUserConfig} from './config.js';
import {ClientServerBody, Context, propertyPriorityList} from 'shared';
import {CACHED_PORT_FILEPATH} from 'shared/constants';
import {grep} from './grep.js';
import {openFileAtLine} from './vscode.js';
import fs from 'fs';
import pathlib from 'path';
import {convertToWindowsPathIfNecessary} from './utils.js';
import _getport from 'get-port';

export async function resolvePort(): Promise<number> {
	let port: number;
	// We resolve the port value following these priorities
	// 1. Cached port
	const portFilePath = convertToWindowsPathIfNecessary(CACHED_PORT_FILEPATH);
	if (fs.existsSync(portFilePath)) {
		return parseInt(fs.readFileSync(CACHED_PORT_FILEPATH).toString());
	}
	// 2. User-defined port
	const config = getUserConfig();
	if (config && config.port) {
		port = config.port;
	}

	// 3. Get a random port
	if (!port) {
		port = await _getport();
	}

	// Cache the port
	fs.writeFile(CACHED_PORT_FILEPATH, `${port}`, () => {});

	return port;
}

export function startServer(options: ServerOptions) {
	const app = new Koa();
	const router = new KoaRouter();

	app.use(cors());
	app.use(bodyParser());

	router.post('/', (ctx) => {
		const body = ctx.request.body as ClientServerBody;
		if (!('context' in body)) {
			ctx.throw();
		}
		const context: Context = body.context;

		for (const nodeInfo of context) {
			for (const property of propertyPriorityList) {
				let search = nodeInfo[property];
				if (search === undefined) {
					continue;
				}
				if (property === 'tagName') {
					search = `<${search}`;
				}
				if (property === 'id') {
					search = `id="${search}"`;
				}
				if (property === 'classText') {
					search = `class="${search}"`;
				}
				if (property === 'styleText') {
					search = `style="${search}"`;
				}
				const grepResult = grep(search, options.include);
				if (grepResult.length === 1) {
					const result = grepResult[0];
					// We have a good match because it's unique, we can open the file
					openFileAtLine(
						pathlib.resolve(result.filepath),
						result.line,
						result.column + 1
					);
					return (ctx.body = '');
				}
			}
		}
	});

	app.use(router.allowedMethods()).use(router.routes());

	app.listen(options.port, () => {
		console.log(
			'=====================================================\n' +
				`VSCode UI Connector Server listening on port ${options.port}\n` +
				'=====================================================\n'
		);
	});
}
