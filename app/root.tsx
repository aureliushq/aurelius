import { type ReactNode, useEffect, useState } from 'react'

import type { LinksFunction } from '@remix-run/node'
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
} from '@remix-run/react'

import type { Evolu, EvoluSchema } from '@evolu/common'
import { EvoluProvider } from '@evolu/react'
import { Button } from '~/components/ui/button'
import { Toaster } from '~/components/ui/toaster'
import { TooltipProvider } from '~/components/ui/tooltip'
import stylesheet from '~/globals.css?url'
import AureliusProvider from '~/lib/providers/aurelius'
import { ThemeProvider, useTheme } from '~/lib/providers/theme'
import { createEvoluClient } from '~/services/evolu/client'
import writerStylesheet from '~/writer.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
	{ rel: 'stylesheet', href: writerStylesheet },
]

const App = ({ children }: { children: ReactNode }) => {
	const { theme } = useTheme()

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://medama.i4o.dev/script.js'
		script.defer = true
		script.setAttribute('data-hash', 'true')
		document.head.appendChild(script)

		return () => {
			document.head.removeChild(script)
		}
	}, [])

	return (
		<html className={theme ?? 'dark'} lang='en'>
			<head>
				<title>Aurelius</title>
				<meta name='description' content='' />
				<link rel='preconnect' href='https://fonts.bunny.net' />
				<link
					rel='stylesheet'
					href='https://fonts.bunny.net/css?family=inter:100,200,300,400,500,600,700,800,900|lato:400,700|libre-baskerville:400,700|merriweather:400,700|noto-serif:400,700|open-sans:400,700|pt-serif:400,700|roboto:400,700'
					crossOrigin='anonymous'
				/>
				<link rel='manifest' href='/site.webmanifest' />
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/favicon-16x16.png'
				/>
				<link
					rel='mask-icon'
					color='#5bbad5'
					href='/safari-pinned-tab.svg'
				/>
				<Meta />
				<Links />
			</head>
			<body className='w-screen h-screen !p-0'>
				{children}
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

const ErrorComponent = () => {
	const error = useRouteError()
	const { theme } = useTheme()

	let title: string
	let message: string
	// @ts-expect-error: it's fine
	switch (error?.status) {
		case 404:
			title = '404 Not Found'
			message =
				'We have no idea what you are looking for. Please check the URL.'
			break
		case 500:
			title = 'Server Error'
			message = 'We broke something on our end. Please try again later.'
			break
		default:
			title = 'Oops!'
			message =
				// @ts-expect-error: it's fine
				error?.message ??
				'Something unexpected happened. Please try again later.'
	}

	return (
		<div className='flex w-full h-full items-center justify-center'>
			<div className='flex flex-col items-center gap-4'>
				<img
					alt='Error'
					className={`w-64 h-64 ${theme === 'dark' ? 'invert' : ''}`}
					src='/images/crashed-error.svg'
				/>
				<h1 className='text-4xl font-bold'>{title}</h1>
				<p className='text-lg text-gray-500'>{message}</p>
				<Link to='/'>
					<Button>Back to Home</Button>
				</Link>
			</div>
		</div>
	)
}

export const ErrorBoundary = () => {
	const evolu = createEvoluClient()

	return (
		<ThemeProvider>
			<EvoluProvider
				// @ts-ignore
				value={evolu}
			>
				<AureliusProvider>
					<App>
						<ErrorComponent />
					</App>
				</AureliusProvider>
			</EvoluProvider>
		</ThemeProvider>
	)
}

const AppWithProviders = () => {
	const evolu = createEvoluClient()

	return (
		<ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
			<EvoluProvider
				// @ts-ignore
				value={evolu}
			>
				<TooltipProvider>
					<AureliusProvider>
						<App>
							<Outlet />
						</App>
					</AureliusProvider>
				</TooltipProvider>
			</EvoluProvider>
		</ThemeProvider>
	)
}

export default AppWithProviders
