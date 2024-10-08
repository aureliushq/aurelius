import { type ChangeEvent, forwardRef, useEffect, useRef } from 'react'

import { type Editor, EditorContent } from '@tiptap/react'
import { Textarea } from '~/components/ui/textarea'
import type { SettingsRow } from '~/services/evolu/client'

type WriterProps = {
	content: string
	editor: Editor | null
	onTitleBlur?: () => void
	settings: SettingsRow
	setTitle: (title: string) => void
	title: string
}

const Writer = forwardRef<HTMLTextAreaElement, WriterProps>(
	({ content, editor, onTitleBlur, settings, setTitle, title }, titleRef) => {
		const internalRef = useRef<HTMLTextAreaElement | null>(null)

		// biome-ignore lint: correctness/useExhaustiveDependencies
		useEffect(() => {
			if (!title && !content) {
				internalRef.current?.focus()
			} else if (!content) {
				editor?.commands.focus('end')
			} else {
				internalRef.current?.focus()
			}
		}, [])

		// biome-ignore lint: correctness/useExhaustiveDependencies
		useEffect(() => {
			const textarea = internalRef.current
			if (textarea) {
				textarea.style.height = 'inherit'
				textarea.style.height = `${textarea.scrollHeight}px`
			}
		}, [title])

		const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
			setTitle(e.target.value)
		}

		return (
			<section className='flex h-full w-full flex-grow flex-col items-center justify-start z-9'>
				<div className='flex h-full w-full flex-col items-center justify-start gap-6 px-4 pb-24 md:pb-16 lg:px-0 pt-32'>
					<div className='w-full max-w-2xl'>
						<Textarea
							autoFocus
							className={`w-full min-h-[48px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex items-center resize-none overflow-y-hidden bg-transparent text-xl font-semibold leading-snug text-foreground focus:outline-none lg:text-3xl lg:leading-snug ${settings?.titleFont}`}
							onBlur={onTitleBlur}
							onChange={handleTitleChange}
							placeholder='Untitled'
							ref={(element) => {
								internalRef.current = element
								if (typeof titleRef === 'function') {
									titleRef(element)
								} else if (titleRef) {
									titleRef.current = element
								}
							}}
							rows={1}
							value={title}
						/>
					</div>
					<div
						className={`editor-wrapper prose dark:prose-invert flex h-auto min-h-max w-full items-start justify-center pb-12 ${settings?.bodyFont}`}
					>
						<EditorContent editor={editor as Editor} />
					</div>
				</div>
			</section>
		)
	},
)

export default Writer
