// import { Link } from '@remix-run/react'
// import { ExternalLinkIcon } from 'lucide-react'
import { Link } from '@remix-run/react'

import { ExternalLinkIcon } from 'lucide-react'
import KeyboardShortcut from '~/components/editor/keyboard-shortcut'
import { Button } from '~/components/ui/button'
// import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
// import { Separator } from '~/components/ui/separator'
import { FORMATTING_SHORTCUTS } from '~/lib/constants'
import {
	allShortcuts,
	getGlobalShortcuts,
} from '~/lib/hooks/useKeyboardShortcuts'
import { HelpDialogProps, ShortcutConfig } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'

const HelpDialog = ({ helpOpen, setHelpOpen }: HelpDialogProps) => {
	return (
		<Dialog onOpenChange={setHelpOpen} open={helpOpen}>
			<DialogContent className='w-[48rem] max-w-none flex flex-col gap-8'>
				<DialogHeader className='flex flex-col gap-2'>
					<DialogTitle>Help</DialogTitle>
					<Separator />
					<div className='flex items-center gap-2'>
						<Link
							prefetch='intent'
							rel='noopener noreferrer'
							target='_blank'
							to='/help/getting-started'
						>
							<Button size='sm' variant='secondary'>
								<ExternalLinkIcon className='w-4 h-4 mr-2' />
								<span>Getting Started</span>
							</Button>
						</Link>
						{/*	<Link to='/blog'>*/}
						{/*		<Button size='sm' variant='secondary'>*/}
						{/*			<ExternalLinkIcon className='w-4 h-4 mr-2' />*/}
						{/*			<span>Read our blog</span>*/}
						{/*		</Button>*/}
						{/*	</Link>*/}
					</div>
				</DialogHeader>
				<div className='columns-2 gap-x-8'>
					<section className='flex flex-col items-start justify-start gap-4 mb-4'>
						<h4 className='text-base font-semibold'>
							Formatting Shortcuts
						</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							{FORMATTING_SHORTCUTS.map((config, index) => {
								const { description, key, modifiers } =
									config as ShortcutConfig

								return (
									<li
										className='flex items-center justify-between px-4 py-2'
										key={index}
									>
										<p>{description}</p>
										<KeyboardShortcut
											keys={getShortcutWithModifiers(
												key,
												modifiers
											)}
										/>
									</li>
								)
							})}
						</ul>
					</section>
					<section className='break-inside-avoid-column flex flex-col items-start justify-start gap-4 mb-4'>
						<h4 className='text-base font-semibold'>
							Keyboard Shortcuts
						</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							{[
								...Object.entries(allShortcuts),
								...Object.entries(getGlobalShortcuts()),
							].map(([_, config], index) => {
								const { description, key, modifiers } =
									config as ShortcutConfig

								return (
									<li
										className='flex items-center justify-between px-4 py-2'
										key={index}
									>
										<p>{description}</p>
										<KeyboardShortcut
											keys={getShortcutWithModifiers(
												key,
												modifiers
											)}
										/>
									</li>
								)
							})}
						</ul>
					</section>
					<section className='break-inside-avoid-column flex flex-col items-start justify-start gap-4 mb-4'>
						<h4 className='text-base font-semibold'>
							Markdown Shortcuts
						</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>## text</p>
								<p>Heading 2</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>### text</p>
								<p>Heading 3</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>#### text</p>
								<p>Heading 4</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>- text</p>
								<p>Bulleted List</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>1. text</p>
								<p>Numbered List</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>**text**</p>
								<p>Bold</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>*text*</p>
								<p>Italics</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>~text~</p>
								<p>Strikethrough</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>[text](url)</p>
								<p>Hyperlink</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>==text==</p>
								<p>Highlight</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>`text`</p>
								<p>Inline Code</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>```</p>
								<p>Code Block</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>{'> text'}</p>
								<p>Blockquote</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>---</p>
								<p>Divider</p>
							</li>
						</ul>
					</section>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default HelpDialog
