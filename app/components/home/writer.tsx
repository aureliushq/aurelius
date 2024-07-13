import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

import { Editor, EditorContent } from '@tiptap/react'
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
