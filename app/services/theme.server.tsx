import { createCookieSessionStorage } from '@remix-run/node'

import { createThemeSessionResolver } from 'remix-themes'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__aurelius_theme',
		secure: true,
		sameSite: 'lax',
		secrets: [
			'85d6bdaa0853d014e857148fb11187737ef416ea9256aadbf2c6de097061bb2b',
		],
		path: '/',
		httpOnly: true,
	},
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
