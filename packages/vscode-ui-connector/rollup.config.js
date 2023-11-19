import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
export default {
	input: 'out/index.js',
	output: {
		file: 'dist/index.js',
	},
	plugins: [
		nodeResolve({
			resolveOnly: ['shared'],
		}),
		terser(),
	],
};
