import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev'

import { RemixVitePWA } from '@vite-pwa/remix'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const { RemixVitePWAPlugin, RemixPWAPreset } = RemixVitePWA()

export default defineConfig({
	plugins: [
		remixCloudflareDevProxy(),
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
			presets: [RemixPWAPreset()],
		}),
		RemixVitePWAPlugin({
			base: '/',
			devOptions: {
				enabled: true,
				suppressWarnings: true,
				type: 'module',
			},
			filename: 'sw.ts',
			includeAssets: [
				'apple-touch-icon.png',
				'favicon-32x32.png',
				'favicon-16x16.png',
				'favicon.ico',
				'fonts/*.ttf',
			],
			injectManifest: {
				globPatterns: ['**/*.{js,css,html,png,svg,ico,json,wasm}'],
			},
			injectRegister: 'auto',
			manifest: {
				name: 'Aurelius',
				short_name: 'Aurelius',
				description:
					'Aurelius: A secure writing app that helps you build consistent writing habits. Enjoy a clutter-free writing space, set timed sessions, and organize multiple projects - all while keeping your work private.',
				theme_color: '#2cb67d',
				background_color: '#010101',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'pwa-maskable-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: 'pwa-maskable-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
				start_url: '/',
				edge_side_panel: {
					preferred_width: 480,
				},
			},
			registerType: 'prompt',
			remix: {
				injectManifest: {
					clientsClaimMode: 'auto',
				},
			},
			srcDir: 'app',
			strategies: 'injectManifest',
		}),
		tsconfigPaths(),
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
