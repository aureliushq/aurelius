import { LinksFunction, LoaderFunction } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'

import { EvoluProvider } from '@evolu/react'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'
import { Toaster } from '~/components/ui/toaster'
import stylesheet from '~/globals.css?url'
import { evolu } from '~/services/evolu/client'
import { themeSessionResolver } from '~/services/theme.server'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.bunny.net' },
	{
		rel: 'stylesheet',
		href: 'https://fonts.bunny.net/css?family=inter:100,200,300,400,500,600,700,800,900|lato:400,700|libre-baskerville:400,700|merriweather:400,700|noto-serif:400,700|open-sans:400,700|pt-serif:400,700|roboto:400,700',
		crossOrigin: 'anonymous',
	},
	{ rel: 'stylesheet', href: stylesheet },
]

export const loader: LoaderFunction = async ({ request }) => {
	const { getTheme } = await themeSessionResolver(request)
	return {
		theme: getTheme(),
	}
}

function App() {
	const data = useLoaderData<typeof loader>()
	const [theme] = useTheme()

	return (
		<html className={theme ?? 'dark'} lang='en'>
			<head>
				<title>Aurelius</title>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
				<Links />
			</head>
			<body className='w-screen h-screen !p-0'>
				<Outlet />
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()

	return (
		<ThemeProvider specifiedTheme={data?.theme} themeAction='/action/theme'>
			<EvoluProvider value={evolu}>
				<App />
			</EvoluProvider>
		</ThemeProvider>
	)
}
