import { ReactNode, Suspense } from 'react'

import { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
	useRouteLoaderData,
} from '@remix-run/react'

import { EvoluProvider, useQuery } from '@evolu/react'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'
import LoadingScreen from '~/components/common/loading-screen'
import { Button } from '~/components/ui/button'
import { Toaster } from '~/components/ui/toaster'
import { TooltipProvider } from '~/components/ui/tooltip'
import stylesheet from '~/globals.css?url'
import AureliusProvider from '~/lib/providers/aurelius'
import { evolu, settingsQuery } from '~/services/evolu/client'
import { themeSessionResolver } from '~/services/theme.server'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.bunny.net' },
	{
		rel: 'stylesheet',
		href: 'https://fonts.bunny.net/css?family=inter:100,200,300,400,500,600,700,800,900|lato:400,700|libre-baskerville:400,700|merriweather:400,700|noto-serif:400,700|open-sans:400,700|pt-serif:400,700|roboto:400,700',
		crossOrigin: 'anonymous',
	},
	{ rel: 'stylesheet', href: stylesheet },
	{ rel: 'manifest', href: '/site.webmanifest' },
	{
		rel: 'apple-touch-icon',
		sizes: '180x180',
		href: '/apple-touch-icon.png',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '32x32',
		href: '/favicon-32x32.png',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '16x16',
		href: '/favicon-16x16.png',
	},
	{ rel: 'mask-icon', color: '#5bbad5', href: '/safari-pinned-tab.svg' },
]

export const meta: MetaFunction = () => [
	{
		charSet: 'utf-8',
	},
	{
		name: 'msapplication-TileColor',
		content: '#2b5797',
	},
	{
		property: 'og:site',
		content: 'https://aurelius.ink',
	},
	{
		property: 'og:url',
		content: 'https://aurelius.ink',
	},
	{
		property: 'og:title',
		content: 'Aurelius - Privacy-Focused Writing App',
	},
	{
		property: 'og:description',
		content:
			'A privacy-focused writing app that helps you build consistent writing habits. Enjoy a clutter-free writing space, set timed sessions, and organize multiple projects - all while keeping your work private.',
	},
	{
		property: 'og:type',
		content: 'website',
	},
	{
		property: 'og:image',
		content: '/images/og.png',
	},
	{
		name: 'theme-color',
		content: '#ffffff',
	},
	{
		title: 'Aurelius - Privacy-Focused Writing App',
	},
	{
		name: 'description',
		content:
			'A privacy-focused writing app that helps you build consistent writing habits. Enjoy a clutter-free writing space, set timed sessions, and organize multiple projects - all while keeping your work private.',
	},
	{
		name: 'keywords',
		content:
			"writing app, distraction-free writing, writing habits, private writing, timed writing sessions, writer's tool, creative writing, journaling",
	},
	{
		name: 'twitter:card',
		content: 'summary_large_image',
	},
	{
		name: 'twitter:site',
		content: '@aurelius_ink',
	},
	{
		name: 'twitter:url',
		content: 'https://aurelius.ink/',
	},
	{
		name: 'twitter:creator',
		content: '@aurelius_ink',
	},
	{
		name: 'twitter:title',
		content: 'Aurelius - Privacy-Focused Writing App',
	},
	{
		name: 'twitter:description',
		content:
			'A privacy-focused writing app that helps you build consistent writing habits. Enjoy a clutter-free writing space, set timed sessions, and organize multiple projects - all while keeping your work private.',
	},
	{
		name: 'twitter:image',
		content: '/images/og.png',
	},
	{
		name: 'viewport',
		content: 'width=device-width,initial-scale=1',
	},
]

export const loader: LoaderFunction = async ({ request }) => {
	const { getTheme } = await themeSessionResolver(request)
	return {
		theme: getTheme(),
	}
}

const App = ({ children }: { children: ReactNode }) => {
	const data = useRouteLoaderData<typeof loader>('root')
	const [theme] = useTheme()
	const { rows: settings } = useQuery(settingsQuery)

	return (
		<html className={theme ?? 'dark'} lang='en'>
			<head>
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />
				<Links />
			</head>
			<body className='w-screen h-screen !p-0'>
				<AureliusProvider data={{ settings: settings[0] }}>
					{children}
				</AureliusProvider>
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

const Error = () => {
	const error = useRouteError()
	const [theme] = useTheme()

	let title
	let message
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
	const data = useRouteLoaderData<typeof loader>('root')

	return (
		<ThemeProvider specifiedTheme={data?.theme} themeAction='/action/theme'>
			<EvoluProvider value={evolu}>
				<App>
					<Error />
				</App>
			</EvoluProvider>
		</ThemeProvider>
	)
}

const AppWithProviders = () => {
	const data = useLoaderData<typeof loader>()

	return (
		<ThemeProvider specifiedTheme={data?.theme} themeAction='/action/theme'>
			<EvoluProvider value={evolu}>
				<Suspense fallback={<LoadingScreen />}>
					<TooltipProvider>
						<App>
							<Outlet />
						</App>
					</TooltipProvider>
				</Suspense>
			</EvoluProvider>
		</ThemeProvider>
	)
}

export default AppWithProviders
