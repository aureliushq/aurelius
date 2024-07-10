import { Suspense, startTransition, useState } from 'react'

import type { MetaFunction } from '@remix-run/node'

import { useQuery } from '@evolu/react'
import PreferencesDialog from '~/components/common/preferences-dialog'
import HelpButton from '~/components/home/help-button'
import HelpDialog from '~/components/home/help-dialog'
import MainMenu from '~/components/home/main-menu'
import SplashDialog from '~/components/home/splash-dialog'
import { settingsQuery } from '~/services/evolu/client'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export default function Index() {
	const { rows } = useQuery(settingsQuery)
	const settings = rows[0]
	const [helpOpen, setHelpOpen] = useState(false)
	const [preferencesOpen, setPreferencesOpen] = useState(false)

	const handlePreferencesOpen = (state: boolean) => {
		startTransition(() => {
			setPreferencesOpen(state)
		})
	}

	return (
		<>
			<div className='w-screen h-screen'>
				<MainMenu
					setHelpOpen={setHelpOpen}
					setPreferencesOpen={handlePreferencesOpen}
				/>
				<Suspense>
					<SplashDialog
						setHelpOpen={setHelpOpen}
						setPreferencesOpen={handlePreferencesOpen}
						settings={settings}
					/>
				</Suspense>
				<HelpButton setHelpOpen={setHelpOpen} />
			</div>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
			<Suspense>
				<PreferencesDialog
					preferencesOpen={preferencesOpen}
					setPreferencesOpen={setPreferencesOpen}
				/>
			</Suspense>
		</>
	)
}
