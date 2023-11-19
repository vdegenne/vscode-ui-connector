import Koa from 'koa';
import KoaRouter from '@koa/router';
import {bodyParser} from '@koa/bodyparser';
import cors from '@koa/cors';
import {ServerOptions} from './config.js';
import {NodeInformation, propertyPriorityList} from 'shared';
import {grep} from './grep.js';
import {openFileAtLine} from './vscode.js';
import pathlib from 'path';

export function startServer(options: ServerOptions) {
	const app = new Koa();
	const router = new KoaRouter();

	app.use(cors());
	app.use(bodyParser());

	router.post('/', (ctx) => {
		if (!('infos' in ctx.request.body)) {
			ctx.throw();
		}
		const infos: NodeInformation[] = ctx.request.body.infos;

		for (const info of infos) {
			for (const property of propertyPriorityList) {
				let search = info[property];
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
			`VSCode UI Connector Server listening at http://localhost:${options.port}/`
		);
	});
}
