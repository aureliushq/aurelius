import { Link } from '@remix-run/react'

import { ExternalLinkIcon } from 'lucide-react'
import KeyboardShortcut from '~/components/editor/keyboard-shortcut'
import { Button } from '~/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'
import {
	FORMATTING_SHORTCUTS,
	GENERAL_SHORTCUTS,
	MARKDOWN_SHORTCUTS,
} from '~/lib/constants'
import {
	allShortcuts,
	getGlobalShortcuts,
} from '~/lib/hooks/useKeyboardShortcuts'
import { HelpDialogProps, ShortcutConfig } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'

const HelpDialog = ({ helpOpen, setHelpOpen }: HelpDialogProps) => {
	const APP_SHORTCUTS = [...Object.values(allShortcuts), ...GENERAL_SHORTCUTS]

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
				<h3 className='text-lg font-semibold'>Keyboard Shortcuts</h3>
				<div className='columns-2 gap-x-8'>
					<section className='break-inside-avoid-column flex flex-col items-start justify-start gap-4 mb-4'>
						<h4 className='text-base font-semibold'>App</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							{APP_SHORTCUTS.sort((a, b) => {
								return a.description.localeCompare(
									b.description,
								)
							}).map((config, index) => {
								const { description, key, label, modifiers } =
									config as ShortcutConfig

								return (
									<li
										className='flex items-center justify-between px-4 py-2'
										key={index}
									>
										<p>{description}</p>
										<KeyboardShortcut
											keys={getShortcutWithModifiers(
												label ?? key,
												modifiers,
											)}
										/>
									</li>
								)
							})}
						</ul>
					</section>
					<section className='break-inside-avoid-column flex flex-col items-start justify-start gap-4 mb-4'>
						<h4 className='text-base font-semibold'>Formatting</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							{FORMATTING_SHORTCUTS.sort((a, b) => {
								return a.description.localeCompare(
									b.description,
								)
							}).map((config, index) => {
								const { description, key, label, modifiers } =
									config as ShortcutConfig

								return (
									<li
										className='flex items-center justify-between px-4 py-2'
										key={index}
									>
										<p>{description}</p>
										<KeyboardShortcut
											keys={getShortcutWithModifiers(
												label ?? key,
												modifiers,
											)}
										/>
									</li>
								)
							})}
						</ul>
					</section>
					<section className='break-inside-avoid-column flex flex-col items-start justify-start gap-4 mb-4'>
						<h4 className='text-base font-semibold'>Markdown</h4>
						<ul className='w-full border border-subtle divide-y divide-subtle rounded-lg text-sm'>
							{MARKDOWN_SHORTCUTS.map((config, index) => {
								const { description, key, label, modifiers } =
									config as ShortcutConfig

								return (
									<li
										className='flex items-center justify-between px-4 py-2'
										key={index}
									>
										<p>{description}</p>
										<KeyboardShortcut
											keys={getShortcutWithModifiers(
												label ?? key,
												modifiers,
											)}
											lowercase={true}
										/>
									</li>
								)
							})}
						</ul>
					</section>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default HelpDialog
