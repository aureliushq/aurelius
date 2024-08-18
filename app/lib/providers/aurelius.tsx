import { ReactNode, createContext, startTransition, useState } from 'react'
import { Timer, useTimer } from 'react-use-precision-timer'

import { useNavigate } from '@remix-run/react'

import { useQuery } from '@evolu/react'
import { ROUTES } from '~/lib/constants'
import { useKeyboardShortcuts } from '~/lib/hooks'
import {
	EditorShortcuts,
	WritingSessionSettings,
	WritingSessionStatus,
} from '~/lib/types'
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
	writingSessionOpen: boolean
	setWritingSessionOpen: (open: boolean) => void
	writingSessionSettings: WritingSessionSettings
	setWritingSessionSettings: (settings: WritingSessionSettings) => void
	writingSessionStatus: WritingSessionStatus
	setWritingSessionStatus: (status: WritingSessionStatus) => void
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
	writingSessionOpen: false,
	setWritingSessionOpen: (open: boolean) => {},
	// @ts-expect-error: tradeoff between having this comment in multiple places or one place
	writingSessionSettings: null,
	setWritingSessionSettings: (settings: WritingSessionSettings) => {},
	writingSessionStatus: WritingSessionStatus.NOT_STARTED,
	setWritingSessionStatus: (status: WritingSessionStatus) => {},
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
		[EditorShortcuts.VIEW_ALL_POSTS]: () => viewAllPosts(),
		[EditorShortcuts.VIEW_ALL_WRITING_SESSIONS]: () =>
			viewAllWritingSessions(),
		[EditorShortcuts.WRITING_SESSION]: () =>
			setWritingSessionOpen(!writingSessionOpen),
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
	const [writingSessionOpen, setWritingSessionOpen] = useState(false)
	const [writingSessionSettings, setWritingSessionSettings] =
		useState<WritingSessionSettings>({
			targetDuration: 30,
			focusMode: true,
			music: !!settings?.enableMusicPlayer,
			notifyOnTargetDuration: true,
		})
	const [writingSessionStatus, setWritingSessionStatus] =
		useState<WritingSessionStatus>(WritingSessionStatus.NOT_STARTED)

	const sessionTimer = useTimer()

	const createNewPost = () => {
		handleSplashOpen(false)
		navigate(ROUTES.EDITOR.NEW_POST)
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

	const viewAllPosts = () => {
		navigate(ROUTES.VIEW.POSTS)
	}

	const viewAllWritingSessions = () => {
		navigate(ROUTES.VIEW.WRITING_SESSIONS)
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
		writingSessionOpen,
		setWritingSessionOpen,
		writingSessionSettings,
		setWritingSessionSettings,
		writingSessionStatus,
		setWritingSessionStatus,
	}

	return (
		<AureliusContext.Provider value={data}>
			{children}
		</AureliusContext.Provider>
	)
}

export default AureliusProvider
