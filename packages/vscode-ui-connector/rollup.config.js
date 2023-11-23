import {nodeResolve} from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

/** @type {import('rollup').RollupOptions} */
export default [
	// Content script
	{
		input: './out/content-script/index.js',
		output: {
			file: './dist/content-script.js',
		},
		plugins: [terser()],
	},
	{
		input: './out/cli.js',
		output: {
			file: './dist/cli.js',
		},
		plugins: [cjs(), json(), nodeResolve(), terser()],
	},
];
