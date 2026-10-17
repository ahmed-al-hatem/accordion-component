import { copyFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Library build for the npm package (react-accordion-kit) → lib/
// The docs/playground site is built separately by vite.config.js → dist/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-types',
      closeBundle() {
        copyFileSync('types/index.d.ts', 'lib/index.d.ts');
        copyFileSync('types/index.d.ts', 'lib/index.d.cts');
      },
    },
  ],
  publicDir: false,
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    sourcemap: true,
    // Ship readable code; the consuming app's bundler minifies it.
    minify: false,
    cssCodeSplit: false,
    lib: {
      entry: 'src/components/accordion/index.js',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Hooks + context: mark as a client component for React Server Components.
        banner: '"use client";',
        assetFileNames: 'styles.css',
        exports: 'named',
      },
    },
  },
});
