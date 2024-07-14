import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

import { Editor, EditorContent } from '@tiptap/react'
import EditorToolbar from '~/components/home/editor-toolbar'
import { SettingsRow } from '~/services/evolu/client'

const Writer = ({
	editor,
	getContent,
	settings,
	setTitle,
	title,
}: {
	editor: Editor | null
	getContent: () => string
	settings: SettingsRow
	setTitle: Dispatch<SetStateAction<string>>
	title: string
}) => {
	const titleRef = useRef<HTMLTextAreaElement>(null)

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
			<EditorToolbar editor={editor as Editor} />
			<div className='flex h-full w-full flex-col items-center justify-start px-4 pb-24 md:pb-16 lg:px-0 pt-32'>
				<div className='w-full max-w-2xl'>
					<textarea
						autoFocus
						className={`w-full resize-none overflow-y-hidden bg-transparent text-2xl font-semibold leading-snug text-foreground focus:outline-none lg:text-5xl lg:leading-snug ${settings?.titleFont}`}
						onChange={(e) => setTitle(e.target.value)}
						placeholder='Untitled'
						ref={titleRef}
						rows={1}
						value={title}
					/>
				</div>
				<div
					className={`editor-wrapper prose prose-invert flex h-auto min-h-max w-full items-start justify-center pb-12 ${settings?.bodyFont}`}
				>
					<EditorContent editor={editor as Editor} />
				</div>
			</div>
		</section>
	)
}

export default Writer
