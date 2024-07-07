import { Link } from '@remix-run/react'

import { ExternalLinkIcon } from 'lucide-react'
import KeyboardShortcut from '~/components/home/keyboard-shortcut'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import { SHORTCUTS } from '~/lib/constants'
import { HelpDialogProps } from '~/lib/types'

const HelpDialog = ({ helpOpen, setHelpOpen }: HelpDialogProps) => {
	return (
		<Dialog onOpenChange={setHelpOpen} open={helpOpen}>
			<DialogContent className='w-[48rem] max-w-none flex flex-col gap-8'>
				<DialogHeader className='flex flex-col gap-2'>
					<DialogTitle>Help</DialogTitle>
					<Separator />
					<div className='flex items-center gap-2'>
						<Link to='/docs'>
							<Button size='sm' variant='secondary'>
								<ExternalLinkIcon className='w-4 h-4 mr-2' />
								<span>Documentation</span>
							</Button>
						</Link>
						<Link to='/blog'>
							<Button size='sm' variant='secondary'>
								<ExternalLinkIcon className='w-4 h-4 mr-2' />
								<span>Read our blog</span>
							</Button>
						</Link>
					</div>
				</DialogHeader>
				<div className='grid grid-cols-2 gap-x-8'>
					<section className='col-span-1 flex flex-col items-start justify-start gap-4'>
						<h4 className='text-base font-semibold'>
							Formatting Shortcuts
						</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							<li className='flex items-center justify-between px-4 py-2'>
								<p># text</p>
								<p>H1 heading</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>## text</p>
								<p>H2 heading</p>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>### text</p>
								<p>H3 heading</p>
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
					<section className='col-span-1 flex flex-col items-start justify-start gap-4 mb-4'>
						<h4 className='text-base font-semibold'>
							Keyboard Shortcuts
						</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>New Post</p>
								<KeyboardShortcut keys={SHORTCUTS.NEW_POST} />
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>New Writing Session</p>
								<KeyboardShortcut
									keys={SHORTCUTS.NEW_WRITING_SESSION}
								/>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>Export as Image</p>
								<KeyboardShortcut
									keys={SHORTCUTS.EXPORT_AS_IMAGE}
								/>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>Export as Markdown</p>
								<KeyboardShortcut
									keys={SHORTCUTS.EXPORT_AS_MARKDOWN}
								/>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>Focus Mode</p>
								<KeyboardShortcut keys={SHORTCUTS.FOCUS_MODE} />
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>Reset Editor</p>
								<KeyboardShortcut
									keys={SHORTCUTS.RESET_EDITOR}
								/>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>Preferences</p>
								<KeyboardShortcut
									keys={SHORTCUTS.PREFERENCES}
								/>
							</li>
							<li className='flex items-center justify-between px-4 py-2'>
								<p>Help</p>
								<KeyboardShortcut keys={SHORTCUTS.HELP} />
							</li>
						</ul>
					</section>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default HelpDialog
