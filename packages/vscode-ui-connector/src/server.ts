import Koa from 'koa';
import KoaRouter from '@koa/router';
import {bodyParser} from '@koa/bodyparser';
import cors from '@koa/cors';
import {ServerOptions} from './config.js';
import {ClientServerBody, SearchSchema} from './context.js';
import {grep} from './search/grep.js';
import {openFileAtLine} from './vscode.js';
import {search} from './search/search.js';
import {fileSearch} from './search/fileSearch.js';

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

		const schema: SearchSchema = [
			'tagName',
			'textContent',
			'attributes.id',
			'attributes.style',
			'attributes.class',
			'attributes',
			'classHierarchy',
		];

		try {
			// 1. We grep search all source files for a unique result.
			let result = await search(body.context, schema, (search) =>
				grep(search, options.include)
			);

			const match = result.matches[0];

			const nodeIndex = body.context.indexOf(result.search.node);
			if (nodeIndex === 0) {
				// We found the most close match
				openFileAtLine(match.filepath, match.line, match.column);
				return (ctx.body = '');
			}

			// Continue the search to find a more precise location.
			const narrowedContext = body.context.slice(0, nodeIndex);

			// 2. We try to find a better match for each child
			for (const child of narrowedContext) {
				if (child.typeIndex !== undefined) {
					try {
						const result = await search(
							[child],
							['tagName'],
							(search) => fileSearch(search, match.filepath, match.line),
							(result) => {
								if (result.matches.length > 1) {
									return true;
								}
							}
						);

						if (child.typeIndex <= result.matches.length) {
							const match = result.matches[child.typeIndex];
							openFileAtLine(match.filepath, match.line, match.column);
							return (ctx.body = '');
						}
					} catch (err) {}
				} else {
					try {
						const result = await search([child], ['textContent'], (search) =>
							fileSearch(search, match.filepath, match.line)
						);

						openFileAtLine(
							result.matches[0].filepath,
							result.matches[0].line,
							result.matches[0].column
						);
						return (ctx.body = '');
					} catch (err) {}
				}
			}

			// If nothing was more precisly found we focus first match
			openFileAtLine(match.filepath, match.line, match.column);
			return (ctx.body = '');
		} catch (err) {
			// Nothing was found.
			console.log('nothing was found');
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
