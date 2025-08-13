import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  base: '/puck-demo-email/',
  plugins: [reactRouter(), tsconfigPaths(),],
  // build: {
  //   lib: {
  //     entry: resolve(__dirname, 'lib/main.ts'),
  //     formats: ['es'],
  //   },
  //   copyPublicDir: false,
  //   rollupOptions: {
  //     external: ['react', 'react/jsx-runtime', '@measured/puck'],
  //     output: {
  //       assetFileNames: 'assets/[name][extname]',
  //       entryFileNames: '[name].js',
  //     },
  //   },
  // },
})
