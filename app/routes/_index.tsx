import type { MetaFunction } from '@remix-run/node'

import HelpButton from '~/components/home/help-button'
import MainMenu from '~/components/home/main-menu'
import SplashDialog from '~/components/home/splash-dialog'

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export default function Index() {
	return (
		<div className='w-screen h-screen'>
			<MainMenu />
			<SplashDialog />
			<HelpButton />
		</div>
	)
}
