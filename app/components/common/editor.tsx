import { useContext, useEffect, useRef, useState } from 'react'

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
import {
	BubbleMenu as BubbleMenuWrapper,
	type Editor as TiptapEditor,
	useEditor,
} from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import PreferencesDialog from '~/components/common/preferences-dialog'
import {
	E2EEIndicator,
	EditorToolbar,
	HelpButton,
	HelpDialog,
	MainMenu,
	ResetEditor,
	Saving,
	SplashDialog,
	Writer,
	WritingSessionTimer,
} from '~/components/editor'
import MusicPlayer from '~/components/editor/music-player'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useAutoSave, useKeyboardShortcuts } from '~/lib/hooks'
import {
	AureliusContext,
	type AureliusProviderData,
} from '~/lib/providers/aurelius'
import {
	type EditorData,
	EditorShortcuts,
	EditorToolbarMode,
	WritingSessionStatus,
} from '~/lib/types'

const lowlight = createLowlight(common)

type EditorProps = {
	data: EditorData
	isSaving: boolean
	onAutoSave: (data: EditorData) => void
	onReset?: () => void
	saveOnTitleBlur?: boolean
}

const Editor = ({
	data,
	isSaving,
	onAutoSave,
	onReset,
	saveOnTitleBlur = true,
}: EditorProps) => {
	const shortcuts = {
		[EditorShortcuts.BLUR]: () => blurInputs(),
		[EditorShortcuts.FOCUS_MODE]: () => setFocusMode(!focusMode),
		[EditorShortcuts.FORCE_SAVE]: () => forceSave(),
		[EditorShortcuts.RESET_EDITOR]: () =>
			setResetEditorOpen(!resetEditorOpen),
	}

	const [editorData, setEditorData, forceSave] = useAutoSave({
		initialData: {
			content: data.content,
			title: data.title,
		},
		onAutoSave,
		interval: 10000,
		debounce: 1000,
	})

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
		splashOpen,
		handleSplashOpen,
		settings,
		triggerGlobalShortcut,
		wordCount,
		handleWordCountChange,
		writingSessionOpen,
		setWritingSessionOpen,
		writingSessionSettings,
		setWritingSessionSettings,
		writingSessionStatus,
		setWritingSessionStatus,
	} = useContext<AureliusProviderData>(AureliusContext)

	const { triggerShortcut } = useKeyboardShortcuts(shortcuts)

	const titleRef = useRef<HTMLTextAreaElement>(null)

	const [isTitleFirstEdit, setIsTitleFirstEdit] = useState<boolean>(
		data.title.trim() === '',
	)
	const [resetEditorOpen, setResetEditorOpen] = useState(false)

	const editor = useEditor({
		content: editorData.content,
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
				HTMLAttributes: {
					class: 'not-prose hljs',
				},
			}),
			Youtube.configure({
				width: 762,
				height: 432,
			}),
			Link.configure({ openOnClick: false }),
			Placeholder.configure({
				placeholder: 'Start writing...',
			}),
			Highlight.configure({ multicolor: true }),
			// @ts-expect-error: not sure why this is throwing an error, but I'm going to replace it with individual packages anyway, so it's fine
			StarterKit.configure({
				code: {
					HTMLAttributes: {
						class: 'not-prose hljs',
					},
				},
				codeBlock: false,
				heading: false,
			}),
			CharacterCount,
			TextStyle,
			FontFamily,
			Underline,
			Heading.configure({
				levels: [2, 3, 4],
			}),
		],
		onCreate({ editor }) {
			const html = editor.isEmpty ? '' : editor.getHTML()
			const wordCount = editor.storage.characterCount.words()
			handleContentChange(html)
			handleWordCountChange(wordCount)
		},
		onUpdate({ editor }) {
			const html = editor.isEmpty ? '' : editor.getHTML()
			const wordCount = editor.storage.characterCount.words()
			handleContentChange(html)
			handleWordCountChange(wordCount)
		},
	})

	const blurInputs = () => {
		if (titleRef.current) {
			titleRef.current.blur()
		}
		editor?.commands.blur()
	}

	const confirmResetEditor = () => {
		forceSave()
		onReset?.()
	}

	const handleContentChange = (content: string) => {
		setEditorData({ content })
	}

	const handleTitleBlur = () => {
		if (saveOnTitleBlur) {
			if (editorData.title.trim() !== '') {
				forceSave()
				setIsTitleFirstEdit(false)
			} else {
				setEditorData({ title: editorData.title })
			}
		}
	}

	const handleTitleChange = (title: string) => {
		setEditorData({ title }, { ignoreAutoSave: isTitleFirstEdit })
	}

	// biome-ignore lint: correctness/useExhaustiveDependencies
	useEffect(() => {
		if (data.content) {
			const wordCount = editor.storage.characterCount.words()
			handleWordCountChange(wordCount)
		}
	}, [data.content])

	// biome-ignore lint: correctness/useExhaustiveDependencies
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
							triggerGlobalShortcut={triggerGlobalShortcut}
							triggerShortcut={triggerShortcut}
						/>
						<Saving isSaving={isSaving} />
					</div>
					<div className='col-span-3 bg-background p-4 flex items-center justify-center'>
						{settings?.toolbarMode === EditorToolbarMode.FIXED ? (
							<EditorToolbar editor={editor as TiptapEditor} />
						) : (
							// https://github.com/ueberdosis/tiptap/issues/2658
							<div>
								<BubbleMenuWrapper
									editor={editor as TiptapEditor}
								>
									<EditorToolbar
										editor={editor as TiptapEditor}
									/>
								</BubbleMenuWrapper>
							</div>
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
					{settings?.enableMusicPlayer ? (
						<MusicPlayer
							focusMode={focusMode}
							isMusicPlaying={isMusicPlaying}
							setIsMusicPlaying={setIsMusicPlaying}
						/>
					) : (
						<div />
					)}
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
				<Writer
					content={editorData.content}
					editor={editor}
					onTitleBlur={handleTitleBlur}
					ref={titleRef}
					settings={settings}
					setTitle={handleTitleChange}
					title={editorData.title}
				/>
			</ScrollArea>
			<HelpDialog setHelpOpen={setHelpOpen} helpOpen={helpOpen} />
			<PreferencesDialog
				preferencesOpen={preferencesOpen}
				setPreferencesOpen={handlePreferencesOpen}
				settings={settings}
			/>
			<ResetEditor
				confirmResetEditor={confirmResetEditor}
				resetEditorOpen={resetEditorOpen}
				setResetEditorOpen={setResetEditorOpen}
			/>
			<SplashDialog
				settings={settings}
				setSplashOpen={handleSplashOpen}
				splashOpen={splashOpen}
				triggerGlobalShortcut={triggerGlobalShortcut}
			/>
		</>
	)
}

export default Editor
