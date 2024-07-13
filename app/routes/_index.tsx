import { Suspense, startTransition, useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'

import { useQuery } from '@evolu/react'
import PreferencesDialog from '~/components/common/preferences-dialog'
import E2EEIndicator from '~/components/home/e2ee-indicator'
import HelpButton from '~/components/home/help-button'
import HelpDialog from '~/components/home/help-dialog'
import MainMenu from '~/components/home/main-menu'
import SplashDialog from '~/components/home/splash-dialog'
import Writer from '~/components/home/writer'
import WritingSessionTimer from '~/components/home/writing-session-timer'
import { useKeyboardShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { EditorShortcuts, WritingSessionSettings } from '~/lib/types'
import { settingsQuery } from '~/services/evolu/client'
import writerStylesheet from '~/writer.css?url'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

export default function Index() {
	const shortcuts = {
		[EditorShortcuts.FOCUS_MODE]: () => setFocusMode(!focusMode),
		[EditorShortcuts.HELP]: () => setHelpOpen(!helpOpen),
	}

	const { triggerShortcut } = useKeyboardShortcuts(shortcuts)

	const { rows } = useQuery(settingsQuery)

	const [focusMode, setFocusMode] = useState(false)
	const [helpOpen, setHelpOpen] = useState(false)
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [preferencesOpen, setPreferencesOpen] = useState(false)
	const [wordCount, setWordCount] = useState<number>(0)
	const [writingSessionOpen, setWritingSessionOpen] = useState(false)
	const [writingSessionSettings, setWritingSessionSettings] =
		useState<WritingSessionSettings>({
			targetDuration: 30,
			focusMode: true,
			music: true,
			notifyOnTargetDuration: true,
		})

	const settings = rows[0]

	const handlePreferencesOpen = (state: boolean) => {
		startTransition(() => {
			setPreferencesOpen(state)
		})
	}

	return (
		<>
			<div className='w-screen h-screen relative'>
				<MainMenu
					focusMode={focusMode}
					setHelpOpen={setHelpOpen}
					setPreferencesOpen={handlePreferencesOpen}
					setWritingSessionOpen={setWritingSessionOpen}
					triggerShortcut={triggerShortcut}
				/>
				<div
					className={`absolute top-4 right-4 flex items-center gap-4 transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
				>
					{isSaving && (
						<span className='text-sm text-muted-foreground px-2'>
							Saving...
						</span>
					)}
					<WritingSessionTimer
						setWritingSessionOpen={setWritingSessionOpen}
						setWritingSessionSettings={setWritingSessionSettings}
						writingSessionOpen={writingSessionOpen}
						writingSessionSettings={writingSessionSettings}
					/>
				</div>
				<div
					className={`absolute bottom-4 right-4 flex items-center gap-4 transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
				>
					<E2EEIndicator />

					<HelpButton triggerShortcut={triggerShortcut} />
				</div>
				<div
					className={`absolute bottom-4 left-4 h-9 flex items-center transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
				>
					<span className='text-sm text-muted-foreground px-2'>{`${wordCount} words`}</span>
				</div>
				<Writer
					setIsSaving={setIsSaving}
					settings={settings}
					setWordCount={setWordCount}
				/>
			</div>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
			<Suspense>
				<PreferencesDialog
					preferencesOpen={preferencesOpen}
					setPreferencesOpen={setPreferencesOpen}
				/>
			</Suspense>
			<Suspense>
				<SplashDialog
					setPreferencesOpen={handlePreferencesOpen}
					settings={settings}
					setWritingSessionOpen={setWritingSessionOpen}
					triggerShortcut={triggerShortcut}
				/>
			</Suspense>
		</>
	)
}
