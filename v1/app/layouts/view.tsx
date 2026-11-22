import { type ReactNode, useContext } from 'react'

import PreferencesDialog from '~/components/common/preferences-dialog'
import {
	E2EEIndicator,
	HelpButton,
	HelpDialog,
	MainMenu,
	SplashDialog,
	WritingSessionTimer,
} from '~/components/editor'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useKeyboardShortcuts } from '~/lib/hooks'
import {
	AureliusContext,
	type AureliusProviderData,
} from '~/lib/providers/aurelius'
import { EditorShortcuts } from '~/lib/types'

const ViewLayout = ({ children }: { children: ReactNode }) => {
	const shortcuts = {
		[EditorShortcuts.FOCUS_MODE]: () => setFocusMode(!focusMode),
	}

	const {
		focusMode,
		setFocusMode,
		helpOpen,
		setHelpOpen,
		isMusicPlaying,
		setIsMusicPlaying,
		mainMenuOpen,
		setMainMenuOpen,
		preferencesOpen,
		handlePreferencesOpen,
		settings,
		splashOpen,
		handleSplashOpen,
		triggerGlobalShortcut,
		wordCount,
		writingSessionOpen,
		setWritingSessionOpen,
		writingSessionSettings,
		setWritingSessionSettings,
		setWritingSessionStatus,
	} = useContext<AureliusProviderData>(AureliusContext)

	const { triggerShortcut } = useKeyboardShortcuts(shortcuts)

	return (
		<>
			<ScrollArea className='w-screen h-screen relative'>
				<section className='w-screen fixed top-0 left-0 grid grid-cols-5 z-10'>
					<div className='flex items-center justify-start p-4 gap-4'>
						<MainMenu
							focusMode={focusMode}
							mainMenuOpen={mainMenuOpen}
							setMainMenuOpen={setMainMenuOpen}
							triggerGlobalShortcut={triggerGlobalShortcut}
							triggerShortcut={triggerShortcut}
						/>
					</div>
					<div className='col-span-3 bg-background p-4 flex items-center justify-center' />
					<div className='flex items-center justify-end p-4'>
						<WritingSessionTimer
							enableMusicPlayer={!!settings?.enableMusicPlayer}
							focusMode={focusMode}
							isMusicPlaying={isMusicPlaying}
							setFocusMode={setFocusMode}
							setIsMusicPlaying={setIsMusicPlaying}
							setWritingSessionOpen={setWritingSessionOpen}
							setWritingSessionSettings={
								setWritingSessionSettings
							}
							setWritingSessionStatus={setWritingSessionStatus}
							wordCount={wordCount}
							writingSessionOpen={writingSessionOpen}
							writingSessionSettings={writingSessionSettings}
						/>
					</div>
				</section>
				<section className='flex h-full w-full flex-grow flex-col items-center justify-start z-9'>
					<div className='flex h-full w-full flex-col items-center justify-start gap-6 px-4 pb-24 md:pb-16 lg:px-0 pt-32'>
						<div className='w-full max-w-3xl'>{children}</div>
					</div>
				</section>
				<section className='w-screen fixed bottom-0 left-0 grid grid-cols-2 z-10'>
					{/*{settings?.enableMusicPlayer ? (*/}
					{/*	<MusicPlayer*/}
					{/*		focusMode={focusMode}*/}
					{/*		isMusicPlaying={isMusicPlaying}*/}
					{/*		setIsMusicPlaying={setIsMusicPlaying}*/}
					{/*	/>*/}
					{/*) : (*/}
					<div />
					{/*)}*/}
					<div
						className={`flex items-center justify-end p-4 gap-4 transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
					>
						<span className='text-sm text-muted-foreground'>{`${wordCount} words`}</span>
						<E2EEIndicator />
						<HelpButton
							triggerGlobalShortcut={triggerGlobalShortcut}
						/>
					</div>
				</section>
			</ScrollArea>
			<PreferencesDialog
				preferencesOpen={preferencesOpen}
				setPreferencesOpen={handlePreferencesOpen}
				settings={settings}
			/>
			<SplashDialog
				settings={settings}
				setSplashOpen={handleSplashOpen}
				splashOpen={splashOpen}
				triggerGlobalShortcut={triggerGlobalShortcut}
			/>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
		</>
	)
}

export default ViewLayout
