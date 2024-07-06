import type { MetaFunction } from '@remix-run/node'

import MainMenu from '~/components/home/main-menu'

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
		</div>
	)
}
