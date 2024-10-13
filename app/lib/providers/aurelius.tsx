import {
	type ReactNode,
	createContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { type Timer, useTimer } from 'react-use-precision-timer'

import { useNavigate } from '@remix-run/react'

import type { ExtractRow, Query } from '@evolu/common'
import { useEvolu, useQuery, useSyncState } from '@evolu/react'
import { CheckIcon } from 'lucide-react'
import { useToast } from '~/components/ui/use-toast'
import { IS_RESTORING_KEY, ROUTES } from '~/lib/constants'
import { useKeyboardShortcuts } from '~/lib/hooks'
import {
	EditorShortcuts,
	type WritingSessionSettings,
	WritingSessionStatus,
} from '~/lib/types'
import { arls } from '~/services/arls'
import { type SettingsRow, createSettingsQuery } from '~/services/evolu/client'
import type { PostsTable } from '~/services/evolu/schema'

type PostRow = ExtractRow<Query<PostsTable>>

export type AureliusProviderData = {
	contentId: string
	setContentId: (id: string) => void
	effortId: string
	setEffortId: (id: string) => void
	focusMode: boolean
	setFocusMode: (state: boolean) => void
	helpOpen: boolean
	setHelpOpen: (open: boolean) => void
	isMusicPlaying: boolean
	setIsMusicPlaying: (state: boolean) => void
	latestPosts: ReadonlyArray<PostRow>
	mainMenuOpen: boolean
	setMainMenuOpen: (open: boolean) => void
	preferencesOpen: boolean
	handlePreferencesOpen: (open: boolean) => void
	splashOpen: boolean
	handleSplashOpen: (open: boolean) => void
	sessionTimer: Timer
	settings: SettingsRow
	triggerGlobalShortcut: (shortcutName: string) => void
	wordCount: number
	handleWordCountChange: (count: number) => void
	writingSessionOpen: boolean
	setWritingSessionOpen: (open: boolean) => void
	writingSessionSettings: WritingSessionSettings
	setWritingSessionSettings: (settings: WritingSessionSettings) => void
	writingSessionStatus: WritingSessionStatus
	setWritingSessionStatus: (status: WritingSessionStatus) => void
}

export const AureliusContext = createContext<AureliusProviderData>({
	contentId: '',
	setContentId: () => {},
	effortId: '',
	setEffortId: () => {},
	focusMode: false,
	setFocusMode: () => {},
	helpOpen: false,
	setHelpOpen: () => {},
	isMusicPlaying: false,
	setIsMusicPlaying: () => {},
	latestPosts: [],
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
	wordCount: 0,
	handleWordCountChange: (count: number) => {},
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

	const evolu = useEvolu()
	const settingsQuery = createSettingsQuery(evolu)
	const { rows } = useQuery(settingsQuery)
	const settings = rows[0]

	const wordCountRef = useRef<number>(0)

	const [contentId, setContentId] = useState<string>('')
	const [effortId, setEffortId] = useState<string>('')
	const [focusMode, setFocusMode] = useState(false)
	const [helpOpen, setHelpOpen] = useState(false)
	const [isMusicPlaying, setIsMusicPlaying] = useState(false)
	const [isRestoring, setIsRestoring] = useState(false)
	const [latestPosts, setLatestPosts] = useState<ReadonlyArray<PostRow>>([])
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

	const { _tag } = useSyncState()

	const sessionTimer = useTimer()
	const { toast } = useToast()

	const createNewPost = () => {
		handleSplashOpen(false)
		navigate(ROUTES.EDITOR.POST)
	}

	const handlePreferencesOpen = (open: boolean) => {
		setPreferencesOpen(open)
	}

	const handleSplashOpen = (open: boolean) => {
		setSplashOpen(() => open)
	}

	const handleWordCountChange = (count: number) => {
		wordCountRef.current = count
	}

	const viewAllPosts = () => {
		setMainMenuOpen(() => false)
		handleSplashOpen(false)
		navigate(ROUTES.VIEW.POSTS)
	}

	const viewAllWritingSessions = () => {
		setMainMenuOpen(() => false)
		handleSplashOpen(false)
		navigate(ROUTES.VIEW.WRITING_SESSIONS)
	}

	const data: AureliusProviderData = {
		contentId,
		setContentId,
		effortId,
		setEffortId,
		focusMode,
		setFocusMode,
		helpOpen,
		setHelpOpen,
		isMusicPlaying,
		setIsMusicPlaying,
		latestPosts,
		mainMenuOpen,
		setMainMenuOpen,
		preferencesOpen,
		handlePreferencesOpen,
		splashOpen,
		handleSplashOpen,
		sessionTimer,
		settings,
		triggerGlobalShortcut,
		wordCount: wordCountRef.current,
		handleWordCountChange,
		writingSessionOpen,
		setWritingSessionOpen,
		writingSessionSettings,
		setWritingSessionSettings,
		writingSessionStatus,
		setWritingSessionStatus,
	}

	useEffect(() => {
		const fetchLatestPosts = async () => {
			const posts = await arls.posts.findMany({
				orderBy: { column: 'createdAt', direction: 'desc' },
				limit: 2,
			})
			setLatestPosts(posts)
		}

		const isRestoring = localStorage.getItem(IS_RESTORING_KEY) === 'true'
		setIsRestoring(isRestoring)
		fetchLatestPosts().then(() => {})
	}, [])

	// biome-ignore lint: correctness/useExhaustiveDependencies
	useEffect(() => {
		if (isRestoring && _tag === 'SyncStateIsSynced') {
			toast({
				description: (
					<span className='inline-flex items-center text-base'>
						<span className='w-4 h-4 mr-2 inline-flex items-center justify-center bg-primary rounded-full'>
							<CheckIcon className='w-2 h-2' />
						</span>
						Sync successful. Reloading...
					</span>
				),
			})
			localStorage.setItem(IS_RESTORING_KEY, 'false')
			setTimeout(() => {
				window.location.href = '/'
			}, 3000)
		}
	}, [_tag, settings])

	return (
		<AureliusContext.Provider value={data}>
			{children}
		</AureliusContext.Provider>
	)
}

export default AureliusProvider
