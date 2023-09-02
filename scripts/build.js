import { build } from 'esbuild';

build({
	entryPoints: ['src/index.ts'],
	outfile: 'dist/bundle.js',
	format: 'esm',
	bundle: true,
	//minify: true,
	sourcemap: true,
	keepNames: true
});
