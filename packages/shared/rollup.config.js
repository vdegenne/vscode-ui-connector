import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions[]} */
export default [
	{
		input: './out/content-script/index.js',
		output: {
			file: './dist/content-script.js',
		},
		plugins: [terser()],
	},
];
