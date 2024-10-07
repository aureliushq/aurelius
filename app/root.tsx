import { type ReactNode, useEffect } from 'react'

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

import type { Evolu } from '@evolu/common'
import { EvoluProvider } from '@evolu/react'
import { LoaderCircleIcon } from 'lucide-react'
import { PWAManifest } from '~/components/pwa'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Toaster } from '~/components/ui/toaster'
import { TooltipProvider } from '~/components/ui/tooltip'
import { useToast } from '~/components/ui/use-toast'
import AureliusProvider from '~/lib/providers/aurelius'
import { ThemeProvider, useTheme } from '~/lib/providers/theme'
import { createEvoluClient } from '~/services/evolu/client'
import fontsStylesheet from '~/styles/fonts.css?url'
import globalStylesheet from '~/styles/globals.css?url'
import tokyoNightDarkStylesheet from '~/styles/tokyo-night-dark.css?url'
import writerStylesheet from '~/styles/writer.css?url'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: globalStylesheet },
	{ rel: 'stylesheet', href: fontsStylesheet },
	{ rel: 'stylesheet', href: tokyoNightDarkStylesheet },
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
				<meta
					name='viewport'
					content='width=device-width,initial-scale=1'
				/>
				<title>Aurelius</title>
				<meta
					name='description'
					content='Aurelius: A secure writing app that helps you build consistent writing habits. Enjoy a clutter-free writing space, set timed sessions, and organize multiple projects - all while keeping your work private.'
				/>
				<link
					rel='icon'
					href='/favicon-32x32.png'
					type='image/png'
					sizes='32x32'
				/>
				<link
					rel='icon'
					href='/favicon-16x16.png'
					type='image/png'
					sizes='16x16'
				/>
				<link rel='apple-touch-icon' href='/apple-touch-icon.png' />
				<link rel='manifest' href='/site.webmanifest' />
				<meta
					name='theme-color'
					content='#2cb67d'
					media='(prefers-color-scheme: light)'
				/>
				<meta
					name='theme-color'
					content='#2cb67d'
					media='(prefers-color-scheme: dark)'
				/>
				<Meta />
				<PWAManifest />
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

const DataDeletedToastTitle = () => (
	<span className='flex items-center'>
		<LoaderCircleIcon className='w-4 h-4 mr-2 animate-spin' />
		<span className='text-sm font-semibold'>Please wait...</span>
	</span>
)

const DataDeletedToastContent = () => (
	<div className='pl-6'>
		<span className='text-sm'>Your data is being deleted.</span>
	</div>
)

const ErrorComponent = ({ evolu }: { evolu: Evolu }) => {
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

	const { toast } = useToast()

	const confirmDelete = () => {
		toast({
			description: (
				<>
					<DataDeletedToastTitle />
					<DataDeletedToastContent />
				</>
			),
		})
		setTimeout(() => {
			evolu.resetOwner().then(() => {})
		}, 5000)
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
				<div className='flex items-center gap-4'>
					<Link to='/'>
						<Button>Back to Home</Button>
					</Link>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='destructive'>
								Delete My Data
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you sure?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This will delete your data from this
									browser/device. If you want to recover your
									data later, make sure you have synced your
									data with another device.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction asChild>
									<Button
										className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
										onClick={confirmDelete}
									>
										Yes, I&apos;m sure
									</Button>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
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
						<ErrorComponent
							// @ts-ignore
							evolu={evolu}
						/>
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
