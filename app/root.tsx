import { LinksFunction } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'

import { EvoluProvider } from '@evolu/react'
import { Toaster } from '~/components/ui/toaster'
import stylesheet from '~/globals.css?url'
import { evolu } from '~/services/evolu/client'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.bunny.net' },
	{
		rel: 'stylesheet',
		href: 'https://fonts.bunny.net/css?family=inter:100,200,300,400,500,600,700,800,900|lato:400,700|libre-baskerville:400,700|merriweather:400,700|noto-serif:400,700|open-sans:400,700|pt-serif:400,700|roboto:400,700',
		crossOrigin: 'anonymous',
	},
	{ rel: 'stylesheet', href: stylesheet },
]

export default function App() {
	return (
		<html className='dark' lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<Meta />
				<Links />
			</head>
			<body className='w-screen h-screen !p-0'>
				<EvoluProvider value={evolu}>
					<Outlet />
					<Toaster />
				</EvoluProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
