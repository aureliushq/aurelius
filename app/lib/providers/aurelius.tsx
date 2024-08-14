import { ReactNode, createContext, startTransition, useState } from 'react'
import { Timer, useTimer } from 'react-use-precision-timer'

import { useNavigate } from '@remix-run/react'

import { useQuery } from '@evolu/react'
import { useKeyboardShortcuts } from '~/lib/hooks'
import { EditorShortcuts } from '~/lib/types'
import { SettingsRow, settingsQuery } from '~/services/evolu/client'

export type AureliusProviderData = {
	helpOpen: boolean
	setHelpOpen: (open: boolean) => void
	mainMenuOpen: boolean
	setMainMenuOpen: (open: boolean) => void
	preferencesOpen: boolean
	handlePreferencesOpen: (open: boolean) => void
	splashOpen: boolean
	handleSplashOpen: (open: boolean) => void
	sessionTimer: Timer
	settings: SettingsRow
	triggerGlobalShortcut: (shortcutName: string) => void
}

export const AureliusContext = createContext<AureliusProviderData>({
	helpOpen: false,
	setHelpOpen: () => {},
	mainMenuOpen: false,
	setMainMenuOpen: () => {},
	preferencesOpen: false,
	handlePreferencesOpen: (open: boolean) => {},
	splashOpen: false,
	handleSplashOpen: (open: boolean) => {},
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	sessionTimer: null,
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	settings: null,
	triggerGlobalShortcut: (shortcutName: string) => {},
})

type AureliusProviderProps = {
	children: ReactNode
}

const AureliusProvider = ({ children }: AureliusProviderProps) => {
	const shortcuts = {
		[EditorShortcuts.HELP]: () => setHelpOpen(!helpOpen),
		[EditorShortcuts.MAIN_MENU]: () => setMainMenuOpen(!mainMenuOpen),
		[EditorShortcuts.NEW_POST]: () => createNewPost(),
		[EditorShortcuts.PREFERENCES]: () =>
			handlePreferencesOpen(!preferencesOpen),
		[EditorShortcuts.SPLASH_DIALOG]: () => handleSplashOpen(!splashOpen),
	}

	const { triggerShortcut: triggerGlobalShortcut } =
		useKeyboardShortcuts(shortcuts)

	const navigate = useNavigate()

	const { rows } = useQuery(settingsQuery)
	const settings = rows[0]

	const [helpOpen, setHelpOpen] = useState(false)
	const [mainMenuOpen, setMainMenuOpen] = useState(false)
	const [preferencesOpen, setPreferencesOpen] = useState(false)
	const [splashOpen, setSplashOpen] = useState(!!settings?.showSplashDialog)

	const sessionTimer = useTimer()

	const createNewPost = () => {
		handleSplashOpen(false)
		navigate('/editor/posts')
	}

	const handlePreferencesOpen = (open: boolean) => {
		startTransition(() => {
			setPreferencesOpen(open)
		})
	}

	const handleSplashOpen = (open: boolean) => {
		startTransition(() => {
			setSplashOpen(open)
		})
	}

	const data: AureliusProviderData = {
		helpOpen,
		setHelpOpen,
		mainMenuOpen,
		setMainMenuOpen,
		preferencesOpen,
		handlePreferencesOpen,
		splashOpen,
		handleSplashOpen,
		sessionTimer,
		settings,
		triggerGlobalShortcut,
	}

	return (
		<AureliusContext.Provider value={data}>
			{children}
		</AureliusContext.Provider>
	)
}

export default AureliusProvider
