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
			<body className='w-screen h-screen'>
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
