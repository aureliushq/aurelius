import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import { CharacterCount } from '@tiptap/extension-character-count'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { FontFamily } from '@tiptap/extension-font-family'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Youtube } from '@tiptap/extension-youtube'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { useAutoSave } from '~/lib/hooks'
import { SettingsRow } from '~/services/evolu/client'

const lowlight = createLowlight(common)

const Writer = ({
	setIsSaving,
	settings,
	setWordCount,
}: {
	setIsSaving: Dispatch<SetStateAction<boolean>>
	settings: SettingsRow
	setWordCount: Dispatch<SetStateAction<number>>
}) => {
	const titleRef = useRef<HTMLTextAreaElement>(null)

	const [title, setTitle] = useState<string>('')

	const savePost = (content: string) => {
		setIsSaving(true)
		// TODO: save post to database
		setTimeout(() => {
			setIsSaving(false)
		}, 3000)
	}

	const [getContent, setContent] = useAutoSave({
		data: '',
		onSave: savePost,
		interval: 10000,
		debounce: 3000,
	})

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
		],
		onUpdate({ editor }) {
			let html = editor.isEmpty ? '' : editor.getHTML()
			const wordCount = editor.storage.characterCount.words()
			setContent(html)
			setWordCount(wordCount)
		},
	})

	useEffect(() => {
		if (!title && !getContent()) {
			titleRef.current?.focus()
		}
	}, [title, getContent()])

	useEffect(() => {
		if (titleRef.current) {
			titleRef.current.style.height = 'inherit'
			titleRef.current.style.height = `${titleRef.current.scrollHeight}px`
		}
	}, [title])

	return (
		<section className='flex h-full w-full flex-grow flex-col items-center justify-start'>
			<div className='flex h-full w-full flex-col items-center justify-start gap-4 px-4 py-24 md:py-16 lg:px-0'>
				<div className='w-full max-w-2xl'>
					<textarea
						autoFocus
						className={`min-h-[2rem] w-full resize-none overflow-y-hidden bg-transparent text-2xl font-semibold leading-snug text-foreground focus:outline-none lg:min-h-[6rem] lg:text-5xl lg:leading-snug ${settings?.titleFont}`}
						onChange={(e) => setTitle(e.target.value)}
						placeholder='Title'
						ref={titleRef}
						rows={1}
						value={title}
					/>
				</div>
				<div
					className={`editor-wrapper flex h-auto min-h-max w-full items-start justify-center pb-12 ${settings?.bodyFont}`}
				>
					<EditorContent editor={editor as Editor} />
				</div>
			</div>
		</section>
	)
}

export default Writer
