import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: {
    entry: 'src/index.ts',
  },
  entry: {
    'index': 'src/index.ts',
    'cli/generate': 'src/cli/generate.ts',
  },
  format: ['cjs', 'esm'],
  outDir: 'dist',
  splitting: false,
  target: 'ES2020',
});
