import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev'

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [
		remixCloudflareDevProxy(),
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
		tsconfigPaths(),
		VitePWA({ devOptions: { enabled: true }, registerType: 'autoUpdate' }),
	],
	optimizeDeps: {
		exclude: ['@evolu/common-web', '@sqlite.org/sqlite-wasm'],
	},
	server: {
		port: 3000,
	},
	worker: {
		format: 'es',
	},
})
