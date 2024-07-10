import { Suspense, startTransition, useState } from 'react'

import type { MetaFunction } from '@remix-run/node'

import { useQuery } from '@evolu/react'
import { ShieldCheckIcon } from 'lucide-react'
import PreferencesDialog from '~/components/common/preferences-dialog'
import HelpButton from '~/components/home/help-button'
import HelpDialog from '~/components/home/help-dialog'
import MainMenu from '~/components/home/main-menu'
import SplashDialog from '~/components/home/splash-dialog'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '~/components/ui/tooltip'
import { settingsQuery } from '~/services/evolu/client'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export default function Index() {
	const { rows } = useQuery(settingsQuery)
	const [helpOpen, setHelpOpen] = useState(false)
	const [preferencesOpen, setPreferencesOpen] = useState(false)

	const settings = rows[0]

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
				<div className='absolute bottom-4 right-4 flex items-center gap-4'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger className='p-0' asChild>
								<ShieldCheckIcon className='w-5 h-5 text-primary' />
							</TooltipTrigger>
							<TooltipContent>
								<p className='text-sm text-center'>
									All your data is stored in your device. Sync
									is end-to-end encrypted so <br /> Aurelius
									servers can&apos;t read your data.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<HelpButton setHelpOpen={setHelpOpen} />
				</div>
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
