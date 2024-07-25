import { ReactNode, useState } from 'react'

import {
	E2EEIndicator,
	HelpButton,
	HelpDialog,
	MainMenu,
} from '~/components/editor'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useKeyboardShortcuts } from '~/lib/hooks'
import { EditorShortcuts } from '~/lib/types'

const DefaultLayout = ({ children }: { children: ReactNode }) => {
	const shortcuts = {
		[EditorShortcuts.HELP]: () => setHelpOpen(!helpOpen),
		[EditorShortcuts.MAIN_MENU]: () => setMainMenuOpen(!mainMenuOpen),
	}

	const { triggerShortcut } = useKeyboardShortcuts(shortcuts)

	const [helpOpen, setHelpOpen] = useState(false)
	const [mainMenuOpen, setMainMenuOpen] = useState(false)

	return (
		<>
			<ScrollArea className='w-screen h-screen relative'>
				<section className='w-screen fixed top-0 left-0 z-10'>
					<div className='flex items-center justify-start p-4 gap-4'>
						<MainMenu
							mainMenuOpen={mainMenuOpen}
							setMainMenuOpen={setMainMenuOpen}
							triggerShortcut={triggerShortcut}
						/>
					</div>
				</section>
				<section className='flex h-full w-full flex-grow flex-col items-center justify-start z-9'>
					<div className='flex h-full w-full flex-col items-center justify-start gap-6 px-4 pb-24 md:pb-16 lg:px-0 pt-32'>
						<div className='w-full max-w-2xl'>{children}</div>
					</div>
				</section>
				<section className='w-screen fixed bottom-0 left-0 z-10'>
					<div className='flex items-center justify-end p-4 gap-4'>
						<E2EEIndicator />
						<HelpButton triggerShortcut={triggerShortcut} />
					</div>
				</section>
			</ScrollArea>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
		</>
	)
}

export default DefaultLayout
