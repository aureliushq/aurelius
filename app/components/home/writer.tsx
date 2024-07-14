import { Dispatch, SetStateAction, forwardRef } from 'react'

import { BubbleMenu, Editor, EditorContent } from '@tiptap/react'
import EditorToolbar from '~/components/home/editor-toolbar'
import { Textarea } from '~/components/ui/textarea'
import { EditorToolbarMode } from '~/lib/types'
import { SettingsRow } from '~/services/evolu/client'

type WriterProps = {
	editor: Editor | null
	getContent: () => string
	settings: SettingsRow
	setTitle: Dispatch<SetStateAction<string>>
	title: string
}

const Writer = forwardRef<HTMLTextAreaElement, WriterProps>(
	({ editor, getContent, settings, setTitle, title }, titleRef) => {
		return (
			<section className='flex h-full w-full flex-grow flex-col items-center justify-start'>
				{editor &&
					settings?.defaultToolbarMode ===
						EditorToolbarMode.FIXED && (
						<div className='absolute top-4'>
							<EditorToolbar editor={editor as Editor} />
						</div>
					)}
				<div className='flex h-full w-full flex-col items-center justify-start gap-6 px-4 pb-24 md:pb-16 lg:px-0 pt-32'>
					<div className='w-full max-w-3xl'>
						<Textarea
							autoFocus
							className={`w-full border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex items-center resize-none overflow-y-hidden bg-transparent text-2xl font-semibold leading-snug text-foreground focus:outline-none lg:text-5xl lg:leading-snug ${settings?.titleFont}`}
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
						{editor &&
							settings?.defaultToolbarMode ===
								EditorToolbarMode.FLOATING && (
								<BubbleMenu editor={editor as Editor}>
									<EditorToolbar editor={editor as Editor} />
								</BubbleMenu>
							)}
						<EditorContent editor={editor as Editor} />
					</div>
				</div>
			</section>
		)
	}
)

export default Writer
