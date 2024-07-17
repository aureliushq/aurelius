import { Suspense, startTransition, useRef, useState } from 'react'

import { LinksFunction, MetaFunction } from '@remix-run/node'

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
import { Editor, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
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
import { ScrollArea } from '~/components/ui/scroll-area'
import {
	useAutoSave,
	useSettingsQuery,
	useWritingEffortQuery,
} from '~/lib/hooks'
import { useKeyboardShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import useWritingQuery from '~/lib/hooks/useWritingQuery'
import {
	EditorShortcuts,
	EditorToolbarMode,
	WritingSessionSettings,
} from '~/lib/types'
import writerStylesheet from '~/writer.css?url'

export const meta: MetaFunction = () => {
	return [{ title: 'Aurelius' }, { name: 'description', content: '' }]
}

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: writerStylesheet },
]

const lowlight = createLowlight(common)

export default function Index() {
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

	const { triggerShortcut } = useKeyboardShortcuts(shortcuts)

	const settingsQuery = useSettingsQuery()
	const settings = settingsQuery.read.first()

	const writingEffortQuery = useWritingEffortQuery()
	const writingEffort = writingEffortQuery.read.findBySlug('help')

	const writingQuery = useWritingQuery()
	const helpPosts = writingQuery.read.findByWritingEffortId(writingEffort?.id)
	const gettingStartedGuide = helpPosts?.find(
		(post) => post.slug === 'getting-started'
	)

	const titleRef = useRef<HTMLTextAreaElement>(null)

	const [focusMode, setFocusMode] = useState(false)
	const [helpOpen, setHelpOpen] = useState(false)
	const [isSaving, setIsSaving] = useState<boolean>(false)
	const [mainMenuOpen, setMainMenuOpen] = useState(false)
	const [preferencesOpen, setPreferencesOpen] = useState(false)
	const [resetEditorOpen, setResetEditorOpen] = useState(false)
	const [splashOpen, setSplashOpen] = useState(!!settings?.showSplashDialog)
	const [title, setTitle] = useState<string>(
		gettingStartedGuide?.title as string
	)
	const [wordCount, setWordCount] = useState<number>(0)
	const [writingSessionOpen, setWritingSessionOpen] = useState(false)
	const [writingSessionSettings, setWritingSessionSettings] =
		useState<WritingSessionSettings>({
			targetDuration: 30,
			focusMode: true,
			music: true,
			notifyOnTargetDuration: true,
		})

	const savePost = (content: string) => {
		setIsSaving(true)
		// TODO: save post to database
		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}

	const [getContent, setContent] = useAutoSave({
		data: gettingStartedGuide?.content as string,
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
			// SuperImage.configure({
			// 	inline: true,
			// 	allowBase64: true,
			// 	HTMLAttributes: {
			// 		class: 'super-image',
			// 	},
			// }),
			CodeBlockLowlight.configure({
				lowlight,
			}),
			Youtube.configure({
				width: 762,
				height: 432,
			}),
			// TaskList,
			// TaskItem.configure({
			// 	nested: true,
			// }),
			Link.configure({ linkOnPaste: true, openOnClick: false }),
			Placeholder.configure({
				placeholder: 'Start writing...',
			}),
			Highlight.configure({ multicolor: true }),
			StarterKit.configure({
				heading: {
					levels: [2, 3, 4, 5, 6],
				},
			}),
			CharacterCount,
			TextStyle,
			FontFamily,
			Underline,
			Heading.configure({
				levels: [2, 3, 4],
			}),
		],
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

	return (
		<>
			<ScrollArea className='w-screen h-screen relative'>
				<section className='w-screen fixed top-0 left-0 grid grid-cols-5 z-10'>
					<div className='flex items-center justify-start p-4'>
						<MainMenu
							focusMode={focusMode}
							mainMenuOpen={mainMenuOpen}
							setMainMenuOpen={setMainMenuOpen}
							triggerShortcut={triggerShortcut}
						/>
					</div>
					<div className='col-span-3 bg-background p-4 flex items-center justify-center'>
						{editor &&
							settings?.toolbarMode ===
								EditorToolbarMode.FIXED && (
								<EditorToolbar editor={editor as Editor} />
							)}
					</div>
					<div className='flex items-center justify-end p-4'>
						<WritingSessionTimer
							focusMode={focusMode}
							setWritingSessionOpen={setWritingSessionOpen}
							setWritingSessionSettings={
								setWritingSessionSettings
							}
							wordCount={wordCount}
							writingSessionOpen={writingSessionOpen}
							writingSessionSettings={writingSessionSettings}
						/>
					</div>
				</section>
				<section className='w-screen fixed bottom-0 left-0 grid grid-cols-2 z-10'>
					<div
						className={`p-4 flex items-center transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
					>
						<span className='text-sm text-muted-foreground px-2'>{`${wordCount} words`}</span>
						<Saving isSaving={isSaving} />
					</div>
					<div
						className={`flex items-center justify-end p-4 gap-4 transition-opacity duration-100 hover:opacity-100 ${focusMode ? 'opacity-5' : 'opacity-100'}`}
					>
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
