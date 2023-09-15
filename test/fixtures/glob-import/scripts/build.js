#!/usr/bin/env node

import globImportsPlugin from '../../../../src/index.js';
import { getMonorepoDirpath } from 'get-monorepo-root';
import esbuild from 'esbuild';
import { join } from 'desm';

await esbuild.build({
	bundle: true,
	entryPoints: [join(import.meta.url, '../src/index.ts')],
	outdir: join(import.meta.url, '../dist'),
	plugins: [
		globImportsPlugin({ monorepoDirpath: getMonorepoDirpath(import.meta.url) })
	],
	tsconfigRaw: {
		compilerOptions: {
			experimentalDecorators: true
		}
	}
});
