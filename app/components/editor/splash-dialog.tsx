import { FormEvent, ReactNode } from 'react'

import { Form, Link } from '@remix-run/react'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
	CircleHelpIcon,
	FileTextIcon,
	ListIcon,
	SettingsIcon,
	TimerIcon,
} from 'lucide-react'
import KeyboardShortcut from '~/components/editor/keyboard-shortcut'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog'
import { allShortcuts } from '~/lib/hooks/useKeyboardShortcuts'
import { EditorShortcuts } from '~/lib/types'
import { getShortcutWithModifiers } from '~/lib/utils'
import { arls } from '~/services/arls'
import { SettingsRow } from '~/services/evolu/client'

const SplashDialogButton = ({
	badge,
	icon,
	label,
	onClick,
	shortcut,
}: {
	badge?: string
	icon: ReactNode
	label: string
	onClick?: (...args: unknown[]) => void
	shortcut?: string
}) => {
	return (
		<Button
			className='w-[calc(100%+1rem)] justify-between -ml-4'
			onClick={onClick}
			variant='ghost'
		>
			<span className='inline-flex items-center'>
				{icon}
				{label}
				{badge && (
					<Badge className='ml-2' variant='outline'>
						{badge}
					</Badge>
				)}
			</span>
			{shortcut ? <KeyboardShortcut keys={shortcut} /> : null}
		</Button>
	)
}

type SplashDialogProps = {
	settings: SettingsRow
	setSplashOpen: (open: boolean) => void
	splashOpen?: boolean
	triggerShortcut: (_: string) => void
}

const SplashDialog = ({
	settings,
	setSplashOpen,
	splashOpen,
	triggerShortcut,
}: SplashDialogProps) => {
	const handleChange = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const showSplashDialog = formData.get('dont-show-again') !== 'on'
		arls.settings.update(settings.id, {
			// @ts-ignore
			showSplashDialog,
		})
	}

	// TODO: synced devices is not picking up the correct value initially. it changes after a bit but it should be instant. investigate why.

	return (
		<Dialog onOpenChange={setSplashOpen} open={splashOpen}>
			<DialogContent className='flex max-w-none w-[48rem] p-0 [&>button]:z-10'>
				<VisuallyHidden>
					<DialogHeader>
						<DialogTitle>Splash Dialog</DialogTitle>
						<DialogDescription>
							List of common actions you can do in Aurelius
						</DialogDescription>
					</DialogHeader>
				</VisuallyHidden>
				<div className='flex flex-col min-h-[36rem] h-auto w-full rounded-lg overflow-hidden divide-y divide-subtle'>
					<div className='relative w-full h-[16rem] flex items-start justify-start p-8'>
						<img
							alt='Splash Dialog Cover'
							className='w-full h-full object-cover object-center z-0 absolute top-0 left-0'
							src='/images/splash-screen-cover.png'
						/>
						<div className='w-full h-full absolute top-0 left-0 bg-gray-900/80 z-10' />
						<img
							className='w-32 z-20'
							src={'/images/logo_dark.png'}
							alt='Aurelius Logo'
						/>
					</div>
					<div className='grid grid-cols-2 w-full min-h-[20rem] h-auto flex-1 flex-grow py-8 pl-8 pr-4 gap-x-12 gap-y-4'>
						{/*<div className='col-span-2 flex items-center'>*/}
						{/*	<Input placeholder='Search Posts' />*/}
						{/*</div>*/}
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								New Content
							</h3>
							<ul className='text-sm flex flex-col gap-1'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<FileTextIcon className='mr-2 w-4 h-4' />
										}
										label='Start New Post'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.NEW_POST
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.NEW_POST
											].key,
											allShortcuts[
												EditorShortcuts.NEW_POST
											].modifiers
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<TimerIcon className='mr-2 w-4 h-4' />
										}
										label='Start a Writing Session'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.WRITING_SESSION
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.WRITING_SESSION
											].key,
											allShortcuts[
												EditorShortcuts.WRITING_SESSION
											].modifiers
										)}
									/>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<h3 className='text-sm font-semibold text-foreground mb-4'>
								Manage Content
							</h3>
							<ul className='w-full text-sm flex flex-col gap-1'>
								{/*<li className='w-full flex items-center justify-between'>*/}
								{/*	<SplashDialogButton*/}
								{/*		icon={*/}
								{/*			<PencilIcon className='mr-2 w-4 h-4' />*/}
								{/*		}*/}
								{/*		label='Resume Recent Post'*/}
								{/*	/>*/}
								{/*</li>*/}
								<li className='w-full flex items-center justify-between'>
									<Link className='w-full' to='/dashboard'>
										<SplashDialogButton
											icon={
												<ListIcon className='mr-2 w-4 h-4' />
											}
											label='View All Posts'
											onClick={() =>
												triggerShortcut(
													EditorShortcuts.VIEW_ALL_POSTS
												)
											}
											shortcut={getShortcutWithModifiers(
												allShortcuts[
													EditorShortcuts
														.VIEW_ALL_POSTS
												].key,
												allShortcuts[
													EditorShortcuts
														.VIEW_ALL_POSTS
												].modifiers
											)}
										/>
									</Link>
								</li>
							</ul>
						</div>
						<div className='col-span-1 py-2 flex flex-col'>
							<ul className='text-sm flex flex-col gap-1'>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<SettingsIcon className='mr-2 w-4 h-4' />
										}
										label='Preferences'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.PREFERENCES
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[
												EditorShortcuts.PREFERENCES
											].key,
											allShortcuts[
												EditorShortcuts.PREFERENCES
											].modifiers
										)}
									/>
								</li>
								<li className='w-full flex items-center justify-between'>
									<SplashDialogButton
										icon={
											<CircleHelpIcon className='mr-2 w-4 h-4' />
										}
										label='Help'
										onClick={() =>
											triggerShortcut(
												EditorShortcuts.HELP
											)
										}
										shortcut={getShortcutWithModifiers(
											allShortcuts[EditorShortcuts.HELP]
												.key,
											allShortcuts[EditorShortcuts.HELP]
												.modifiers
										)}
									/>
								</li>
							</ul>
						</div>
						<div className='col-span-1' />
						<div className='col-span-2 flex flex-col'>
							<p className='leading-relaxed italic text-sm text-foreground'>
								Note: All your data will be saved locally in the
								browser.{' '}
								<Link
									className='underline'
									prefetch='intent'
									to='/privacy'
								>
									Learn more
								</Link>
								.
							</p>
						</div>
					</div>
					<Form
						className='w-full px-8 py-4 flex items-center gap-2'
						onChange={handleChange}
					>
						<div className='items-center flex space-x-2'>
							<Checkbox
								name='dont-show-again'
								id='dont-show-again'
							/>
							<label
								htmlFor='dont-show-again'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Don&apos;t show this again.
							</label>
						</div>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default SplashDialog
