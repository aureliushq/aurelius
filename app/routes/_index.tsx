import { useState } from 'react'

import type { MetaFunction } from '@remix-run/node'

import HelpButton from '~/components/home/help-button'
import HelpDialog from '~/components/home/help-dialog'
import MainMenu from '~/components/home/main-menu'
import SplashDialog from '~/components/home/splash-dialog'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export default function Index() {
	const [helpOpen, setHelpOpen] = useState(false)

	return (
		<>
			<div className='w-screen h-screen'>
				<MainMenu setHelpOpen={setHelpOpen} />
				<SplashDialog setHelpOpen={setHelpOpen} />
				<HelpButton setHelpOpen={setHelpOpen} />
			</div>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
		</>
	)
}
