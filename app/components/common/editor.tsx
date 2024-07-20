import {
	Suspense,
	startTransition,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import ReactPlayer from 'react-player'

import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import { CharacterCount } from '@tiptap/extension-character-count'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { FontFamily } from '@tiptap/extension-font-family'
import { Heading } from '@tiptap/extension-heading'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'
import { Youtube } from '@tiptap/extension-youtube'
import { Editor as TiptapEditor, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { PauseIcon, PlayIcon } from 'lucide-react'
import PreferencesDialog from '~/components/common/preferences-dialog'
import E2EEIndicator from '~/components/home/e2ee-indicator'
import EditorToolbar from '~/components/home/editor-toolbar'
import HelpButton from '~/components/home/help-button'
import HelpDialog from '~/components/home/help-dialog'
import MainMenu from '~/components/home/main-menu'
import ResetEditor from '~/components/home/reset-editor'
import Saving from '~/components/home/saving'
import SplashDialog from '~/components/home/splash-dialog'
import Writer from '~/components/home/writer'
import WritingSessionTimer from '~/components/home/writing-session-timer'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { MUSIC_STATIONS } from '~/lib/constants'
import {
	useAutoSave,
	useKeyboardShortcuts,
} from '~/lib/hooks'
import { AureliusContext, AureliusProviderData } from '~/lib/providers/aurelius'
import {
	EditorShortcuts,
	EditorToolbarMode,
	MusicChannels,
	WritingSessionSettings,
	WritingSessionStatus,
} from '~/lib/types'

const lowlight = createLowlight(common)

const Editor = () => {
	const shortcuts = {
		[EditorShortcuts.BLUR]: () => blurInputs(),
		[EditorShortcuts.FOCUS_MODE]: () => setFocusMode(!focusMode),
		[EditorShortcuts.HELP]: () => setHelpOpen(!helpOpen),
		[EditorShortcuts.MAIN_MENU]: () => setMainMenuOpen(!mainMenuOpen),
		[EditorShortcuts.PREFERENCES]: () =>
			handlePreferencesOpen(!preferencesOpen),
		[EditorShortcuts.RESET_EDITOR]: () =>
			setResetEditorOpen(!resetEditorOpen),
		[EditorShortcuts.SPLASH_DIALOG]: () =>
			handleSplashDialogOpen(!splashOpen),
		[EditorShortcuts.WRITING_SESSION]: () =>
			setWritingSessionOpen(!writingSessionOpen),
	}

	const { content, settings, setTitle, title } =
		useContext<AureliusProviderData>(AureliusContext)

	const { triggerShortcut } = useKeyboardShortcuts(shortcuts)

	const titleRef = useRef<HTMLTextAreaElement>(null)

	const [focusMode, setFocusMode] = useState(false)
	const [helpOpen, setHelpOpen] = useState(false)
	const [isMusicPlaying, setIsMusicPlaying] = useState(false)
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [mainMenuOpen, setMainMenuOpen] = useState(false)
	const [preferencesOpen, setPreferencesOpen] = useState(false)
	const [resetEditorOpen, setResetEditorOpen] = useState(false)
	const [splashOpen, setSplashOpen] = useState(!!settings?.showSplashDialog)
	const [wordCount, setWordCount] = useState<number>(0)
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

	const savePost = (content: string) => {
		setIsSaving(true)
		// TODO: save post to database
		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}

	const [getContent, setContent] = useAutoSave({
		data: content,
		onSave: savePost,
		interval: 10000,
		debounce: 3000,
	})

	const handlePreferencesOpen = (state: boolean) => {
		startTransition(() => {
			setPreferencesOpen(state)
		})
	}

	const handleSplashDialogOpen = (state: boolean) => {
		startTransition(() => {
			setSplashOpen(state)
		})
	}

	const editor = useEditor({
		content: getContent(),
		editorProps: {
			attributes: {
				class: '',
			},
		},
		extensions: [
			BubbleMenu.configure({
				tippyOptions: {
					arrow: true,
				},
			}),
			CodeBlockLowlight.configure({
				lowlight,
			}),
			Youtube.configure({
				width: 762,
				height: 432,
			}),
			Link.configure({ linkOnPaste: true, openOnClick: false }),
			Placeholder.configure({
				placeholder: 'Start writing...',
			}),
			Highlight.configure({ multicolor: true }),
			// @ts-expect-error: not sure why this is throwing an error, but I'm going to replace it with individual packages anyway, so it's fine
			StarterKit.configure({}),
			CharacterCount,
			TextStyle,
			FontFamily,
			Underline,
			Heading.configure({
				levels: [2, 3, 4],
			}),
		],
		onCreate({ editor }) {
			let html = editor.isEmpty ? '' : editor.getHTML()
			const wordCount = editor.storage.characterCount.words()
			setContent(html)
			setWordCount(wordCount)
		},
		onUpdate({ editor }) {
			let html = editor.isEmpty ? '' : editor.getHTML()
			const wordCount = editor.storage.characterCount.words()
			setContent(html)
			setWordCount(wordCount)
		},
	})

	const blurInputs = () => {
		if (titleRef.current) {
			titleRef.current.blur()
		}
		editor?.commands.blur()
	}

	const confirmResetEditor = () => {
		setTitle('')
		setContent('')
		editor?.commands.clearContent(true)
		setWordCount(0)
	}

	useEffect(() => {
		if (
			writingSessionStatus === WritingSessionStatus.RUNNING &&
			writingSessionSettings.focusMode
		) {
			setFocusMode(writingSessionSettings.focusMode)
		}
		if (
			writingSessionStatus === WritingSessionStatus.RUNNING &&
			writingSessionSettings.music
		) {
			setIsMusicPlaying(writingSessionSettings.music)
		}
	}, [writingSessionSettings])

	return (
		<>
			<ScrollArea className='w-screen h-screen relative'>
				<section className='w-screen fixed top-0 left-0 grid grid-cols-5 z-10'>
					<div className='flex items-center justify-start p-4 gap-4'>
						<MainMenu
							focusMode={focusMode}
							mainMenuOpen={mainMenuOpen}
							setMainMenuOpen={setMainMenuOpen}
							triggerShortcut={triggerShortcut}
						/>
						<Saving isSaving={isSaving} />
					</div>
					<div className='col-span-3 bg-background p-4 flex items-center justify-center'>
						{editor &&
							settings?.toolbarMode ===
								EditorToolbarMode.FIXED && (
								<EditorToolbar editor={editor as TiptapEditor} />
							)}
					</div>
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
				<section className='w-screen fixed bottom-0 left-0 grid grid-cols-2 z-10'>
					{!!settings?.enableMusicPlayer ? (
						<div
							className={`p-4 flex items-center transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
						>
							{isMusicPlaying ? (
								<Button
									className='w-9 h-9'
									onClick={() => setIsMusicPlaying?.(false)}
									size='icon'
									variant='outline'
								>
									<PauseIcon className='w-4 h-4' />
								</Button>
							) : (
								<Button
									className='w-9 h-9'
									onClick={() => setIsMusicPlaying?.(true)}
									size='icon'
									variant='outline'
								>
									<PlayIcon className='w-4 h-4' />
								</Button>
							)}
							<Suspense fallback={<div>Loading...</div>}>
								<ReactPlayer
									playing={isMusicPlaying}
									// @ts-ignore
									url={
										settings?.youtubeLink ||
										MUSIC_STATIONS[
											settings?.musicChannel as MusicChannels
										]
									}
									width='0'
									height='0'
									loop={true}
									config={{
										youtube: {
											playerVars: {
												control: 1,
												start: 1,
											},
										},
									}}
								/>
							</Suspense>
						</div>
					) : (
						<div />
					)}
					<div
						className={`flex items-center justify-end p-4 gap-4 transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
					>
						<span className='text-sm text-muted-foreground'>{`${wordCount} words`}</span>
						<E2EEIndicator />
						<HelpButton triggerShortcut={triggerShortcut} />
					</div>
				</section>
				<Writer
					editor={editor}
					getContent={getContent}
					settings={settings}
					setTitle={setTitle}
					title={title}
				/>
			</ScrollArea>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
			<Suspense>
				<PreferencesDialog
					preferencesOpen={preferencesOpen}
					setPreferencesOpen={handlePreferencesOpen}
					settings={settings}
				/>
			</Suspense>
			<ResetEditor
				confirmResetEditor={confirmResetEditor}
				resetEditorOpen={resetEditorOpen}
				setResetEditorOpen={setResetEditorOpen}
			/>
			<Suspense>
				<SplashDialog
					settings={settings}
					setSplashOpen={handleSplashDialogOpen}
					splashOpen={splashOpen}
					triggerShortcut={triggerShortcut}
				/>
			</Suspense>
		</>
	)
}

export default Editor
