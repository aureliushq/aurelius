import { ReactNode, Suspense, useContext } from 'react'

import PreferencesDialog from '~/components/common/preferences-dialog'
import {
	E2EEIndicator,
	HelpButton,
	HelpDialog,
	MainMenu,
	SplashDialog,
} from '~/components/editor'
import { ScrollArea } from '~/components/ui/scroll-area'
import { AureliusContext, AureliusProviderData } from '~/lib/providers/aurelius'

const EffortLayout = ({ children }: { children: ReactNode }) => {
	const {
		helpOpen,
		setHelpOpen,
		mainMenuOpen,
		setMainMenuOpen,
		preferencesOpen,
		handlePreferencesOpen,
		settings,
		splashOpen,
		handleSplashOpen,
		triggerGlobalShortcut,
	} = useContext<AureliusProviderData>(AureliusContext)

	return (
		<>
			<ScrollArea className='w-screen h-screen relative'>
				<section className='w-screen fixed top-0 left-0 z-10'>
					<div className='flex items-center justify-start p-4 gap-4'>
						<MainMenu
							mainMenuOpen={mainMenuOpen}
							setMainMenuOpen={setMainMenuOpen}
							triggerShortcut={triggerGlobalShortcut}
						/>
					</div>
				</section>
				<section className='flex h-full w-full flex-grow flex-col items-center justify-start z-9'>
					<div className='flex h-full w-full flex-col items-center justify-start gap-6 px-4 pb-24 md:pb-16 lg:px-0 pt-32'>
						<div className='w-full max-w-3xl'>{children}</div>
					</div>
				</section>
				<section className='w-screen fixed bottom-0 left-0 z-10'>
					<div className='flex items-center justify-end p-4 gap-4'>
						<E2EEIndicator />
						<HelpButton triggerShortcut={triggerGlobalShortcut} />
					</div>
				</section>
			</ScrollArea>
			<Suspense>
				<PreferencesDialog
					preferencesOpen={preferencesOpen}
					setPreferencesOpen={handlePreferencesOpen}
					settings={settings}
				/>
			</Suspense>
			<Suspense>
				<SplashDialog
					settings={settings}
					setSplashOpen={handleSplashOpen}
					splashOpen={splashOpen}
					triggerShortcut={triggerGlobalShortcut}
				/>
			</Suspense>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
		</>
	)
}

export default EffortLayout
