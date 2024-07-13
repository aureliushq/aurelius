import { Level } from '@tiptap/extension-heading'
import { Editor } from '@tiptap/react'
import {
	BoldIcon,
	CodeIcon,
	HighlighterIcon,
	ItalicIcon,
	LinkIcon,
	QuoteIcon,
	UnderlineIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { Toolbar } from '~/components/ui/toolbar'
import {
	EditorHeadings,
	EditorOtherOptions,
	EditorTextStyles,
} from '~/lib/types'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
	const EDITOR_TEXT_STYLES = {
		[EditorTextStyles.BOLD]: {
			action: () => editor?.chain().focus().toggleBold().run(),
			icon: <BoldIcon className='w-4 h-4' />,
		},
		[EditorTextStyles.ITALIC]: {
			action: () => editor?.chain().focus().toggleItalic().run(),
			icon: <ItalicIcon className='w-4 h-4' />,
		},
		[EditorTextStyles.UNDERLINE]: {
			action: () => editor?.chain().focus().toggleUnderline().run(),
			icon: <UnderlineIcon className='w-4 h-4' />,
		},
	}

	const EDITOR_HEADINGS = [
		{ label: 'Normal', level: 0, value: EditorHeadings.NORMAL },
		{ label: 'Heading 2', level: 2, value: EditorHeadings.H2 },
		{ label: 'Heading 3', level: 3, value: EditorHeadings.H3 },
		{ label: 'Heading 4', level: 4, value: EditorHeadings.H4 },
	]

	const EDITOR_OTHER_OPTIONS = {
		[EditorOtherOptions.HIGHLIGHT]: {
			action: () => editor?.chain().focus().toggleHighlight().run(),
			icon: <HighlighterIcon className='w-4 h-4' />,
		},
		[EditorOtherOptions.QUOTE]: {
			action: () => editor?.chain().focus().toggleBlockquote().run(),
			icon: <QuoteIcon className='w-4 h-4' />,
		},
		[EditorOtherOptions.CODE]: {
			action: () => editor?.chain().focus().toggleCodeBlock().run(),
			icon: <CodeIcon className='w-4 h-4' />,
		},
		[EditorOtherOptions.LINK]: {
			action: () => console.log('link'),
			icon: <LinkIcon className='w-4 h-4' />,
		},
	}

	return (
		<>
			<Toolbar className='absolute top-4 flex items-center h-9 p-0 space-x-0'>
				<ToggleGroup
					className='h-full gap-0 divide-x divide-border rounded-tl-md rounded-bl-md rounded-none overflow-hidden'
					type='multiple'
				>
					{Object.entries(EDITOR_TEXT_STYLES).map(
						([key, style], index) => {
							return index === 0 ? (
								<ToggleGroupItem
									asChild
									className='h-9 w-9 rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none'
									key={index}
									value={key}
								>
									<Button
										className='text-foreground'
										onClick={style.action}
										size='icon'
									>
										{style.icon}
									</Button>
								</ToggleGroupItem>
							) : (
								<ToggleGroupItem
									asChild
									className='h-9 w-9 rounded-none'
									key={index}
									value={key}
								>
									<Button
										className='text-foreground'
										onClick={style.action}
										size='icon'
									>
										{style.icon}
									</Button>
								</ToggleGroupItem>
							)
						}
					)}
				</ToggleGroup>
				<Select
					onValueChange={(value) => {
						value !== EditorHeadings.NORMAL
							? editor
									?.chain()
									.focus()
									.toggleHeading({
										level: EDITOR_HEADINGS.find(
											(headings) =>
												headings.value === value
										)?.level as Level,
									})
									.run()
							: editor?.chain().focus().setParagraph().run()
					}}
				>
					<SelectTrigger className='w-[180px] h-9 rounded-none -ml-px'>
						<SelectValue placeholder='Headings' />
					</SelectTrigger>
					<SelectContent>
						{EDITOR_HEADINGS.map((heading) => (
							<SelectItem
								key={heading.value}
								value={heading.value}
							>
								{heading.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<ToggleGroup
					className='h-full gap-0 divide-x divide-border rounded-tr-md rounded-br-md rounded-none overflow-hidden -ml-px'
					type='multiple'
				>
					{Object.entries(EDITOR_OTHER_OPTIONS).map(
						([key, option], index) => {
							return index ===
								Object.entries(EDITOR_OTHER_OPTIONS).length -
									1 ? (
								<ToggleGroupItem
									asChild
									className='h-9 w-9 rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none'
									key={index}
									value={key}
								>
									<Button
										className='text-foreground'
										onClick={option.action}
										size='icon'
									>
										{option.icon}
									</Button>
								</ToggleGroupItem>
							) : (
								<ToggleGroupItem
									asChild
									className='h-9 w-9 rounded-none'
									key={index}
									value={key}
								>
									<Button
										className='text-foreground'
										onClick={option.action}
										size='icon'
									>
										{option.icon}
									</Button>
								</ToggleGroupItem>
							)
						}
					)}
				</ToggleGroup>
			</Toolbar>
		</>
	)
}

export default EditorToolbar
