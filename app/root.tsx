import { ReactNode } from 'react'

import { LinksFunction } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'

import stylesheet from '~/globals.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]

export function Layout({ children }: { children: ReactNode }) {
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
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	)
}
