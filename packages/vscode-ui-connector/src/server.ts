import Koa from 'koa';
import KoaRouter from '@koa/router';
import {bodyParser} from '@koa/bodyparser';
import cors from '@koa/cors';
import {ServerOptions, getUserConfig} from './config.js';
import {ClientServerBody} from 'shared';
import {CACHED_DIRECTORY, CACHED_PORT_FILEPATH} from 'shared/constants';
import {grep} from './search/grep.js';
import {openFileAtLine} from './vscode.js';
import fs from 'fs';
import pathlib from 'path';
import {convertToWindowsPathIfNecessary} from './utils.js';
import _getport from 'get-port';
import {search} from './search/search.js';

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
	if (!fs.existsSync(CACHED_DIRECTORY)) {
		await fs.promises.mkdir(CACHED_DIRECTORY);
	}
	fs.promises.writeFile(CACHED_PORT_FILEPATH, `${port}`);

	return port;
}

export function startServer(options: ServerOptions) {
	const app = new Koa();
	const router = new KoaRouter();

	app.use(cors());
	app.use(bodyParser());

	router.post('/', async (ctx) => {
		const body = ctx.request.body as ClientServerBody;
		if (!body.context) {
			ctx.throw();
		}

		try {
			const [result] = await search(
				body.context, //
				[
					'tagName',
					'textContent',
					'attributes.id',
					'attributes.style',
					'attributes',
				],
				(search) => grep(search, options.include)
			);

			openFileAtLine(result.filepath, result.line, result.column);
		} catch (err) {
			// Nothing was found.
			console.log('nothing was found');
		}

		// for (const nodeInfo of body.context) {
		// 	for (const property of attributePriorityList) {
		// 		let search = nodeInfo[property];
		// 		if (search === undefined) {
		// 			continue;
		// 		}
		// 		if (property === 'tagName') {
		// 			search = `<${search}`;
		// 		}
		// 		if (property === 'id') {
		// 			search = `id="${search}"`;
		// 		}
		// 		if (property === 'classText') {
		// 			search = `class="${search}"`;
		// 		}
		// 		if (property === 'styleText') {
		// 			search = `style="${search}"`;
		// 		}
		// 		const grepResult = grep(search, options.include);
		// 		if (grepResult.length === 1) {
		// 			const result = grepResult[0];
		// 			// We have a good match because it's unique, we can open the file
		// 			openFileAtLine(
		// 				pathlib.resolve(result.filepath),
		// 				result.line,
		// 				result.column + 1
		// 			);
		// 			return (ctx.body = '');
		// 		}
		// 	}
		// }
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
